export interface MetaApiErrorDetail {
  message: string;
  code?: number;
  subcode?: number;
  rawMessage: string;
}

export function normalizeAdAccountId(id: string): string {
  const trimmed = (id || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('act_')) return trimmed;
  return `act_${trimmed}`;
}

export function parseMetaError(errorObj: any): MetaApiErrorDetail {
  const err = errorObj?.error || errorObj;
  const code = err?.code;
  const subcode = err?.error_subcode;
  const rawMessage = err?.message || (typeof err === 'string' ? err : JSON.stringify(err));

  let message = rawMessage;
  if (code === 190 || subcode === 463 || subcode === 467) {
    message = '⚠️ Token de Acesso expirado ou revogado. Gere um novo Token do Usuário no Meta Business Manager com acesso à conta de anúncios.';
  } else if (code === 200 || rawMessage.includes('ads_read') || rawMessage.includes('permission')) {
    message = '⚠️ Permissão insuficiente (`ads_read`). Certifique-se de que o Token do Usuário possui a permissão `ads_read` ou `ads_management` habilitada no Meta Business Manager.';
  } else if (code === 100 || rawMessage.includes('Invalid parameter') || rawMessage.includes('does not exist')) {
    message = '⚠️ ID da Conta de Anúncios (`act_...`) inválido ou não pertencente ao Token de Acesso informado.';
  }

  return {
    message,
    code,
    subcode,
    rawMessage,
  };
}

export async function handleMetaAdsApiRequest(payload: any) {
  const { action, accessToken, adAccountId } = payload;

  if (!accessToken || !adAccountId) {
    return {
      success: false,
      message: 'Faltam credenciais obrigatórias (AccessToken ou AdAccountId).',
      errorDetail: {
        message: 'Faltam credenciais obrigatórias (AccessToken ou AdAccountId).',
        rawMessage: 'Missing accessToken or adAccountId in request payload',
      },
    };
  }

  const actId = normalizeAdAccountId(adAccountId);

  // Direct Graph API fetch attempt
  try {
    const metaApiVersion = 'v19.0';
    const baseUrl = `https://graph.facebook.com/${metaApiVersion}`;

    // 1. Fetch Account Info to validate token & account
    const accountRes = await fetch(`${baseUrl}/${actId}?fields=name,account_id,currency,timezone_name&access_token=${accessToken}`);
    const accountData = await accountRes.json();

    if (accountData.error) {
      const errDetail = parseMetaError(accountData);
      return {
        success: false,
        message: errDetail.message,
        errorDetail: errDetail,
      };
    }

    // 2. Fetch Active Campaigns
    const campaignsRes = await fetch(`${baseUrl}/${actId}/campaigns?fields=id,name,status,effective_status,objective,created_time&limit=50&access_token=${accessToken}`);
    const campaignsData = await campaignsRes.json();

    if (campaignsData.error) {
      const errDetail = parseMetaError(campaignsData);
      return {
        success: false,
        message: errDetail.message,
        errorDetail: errDetail,
      };
    }

    // 3. Fetch Insights per Campaign
    const insightsRes = await fetch(`${baseUrl}/${actId}/insights?fields=campaign_id,campaign_name,impressions,clicks,spend,ctr,cpc,actions,action_values&level=campaign&date_preset=maximum&limit=50&access_token=${accessToken}`);
    const insightsData = await insightsRes.json();

    const insightsMap = new Map<string, any>();
    if (insightsData && Array.isArray(insightsData.data)) {
      insightsData.data.forEach((ins: any) => {
        if (ins.campaign_id) {
          insightsMap.set(ins.campaign_id, ins);
        }
      });
    }

    const rawCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
    const mappedCampaigns = rawCampaigns.map((c: any) => {
      const ins = insightsMap.get(c.id) || {};
      const spend = parseFloat(ins.spend || '0');
      const impressions = parseInt(ins.impressions || '0', 10);
      const clicks = parseInt(ins.clicks || '0', 10);
      const ctr = parseFloat(ins.ctr || '0');
      const cpc = parseFloat(ins.cpc || '0');

      let conversions = 0;
      if (ins.actions && Array.isArray(ins.actions)) {
        const purchaseAction = ins.actions.find(
          (a: any) =>
            a.action_type === 'purchase' ||
            a.action_type === 'offsite_conversion.fb_pixel_purchase' ||
            a.action_type === 'lead'
        );
        if (purchaseAction) {
          conversions = parseInt(purchaseAction.value || '0', 10);
        }
      }

      let purchaseValue = 0;
      if (ins.action_values && Array.isArray(ins.action_values)) {
        const valObj = ins.action_values.find(
          (a: any) =>
            a.action_type === 'purchase' ||
            a.action_type === 'offsite_conversion.fb_pixel_purchase'
        );
        if (valObj) {
          purchaseValue = parseFloat(valObj.value || '0');
        }
      }

      const roas = spend > 0 ? (purchaseValue > 0 ? purchaseValue / spend : (conversions * 97.0) / spend) : 0;
      const costPerConversion = conversions > 0 ? spend / conversions : 0;

      let mappedStatus: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' = 'ACTIVE';
      const statusStr = (c.effective_status || c.status || '').toUpperCase();
      if (statusStr.includes('PAUS')) mappedStatus = 'PAUSED';
      if (statusStr.includes('ARCHIV')) mappedStatus = 'ARCHIVED';

      return {
        id: c.id,
        name: c.name,
        status: mappedStatus,
        spend,
        impressions,
        clicks,
        ctr,
        cpc,
        conversions,
        costPerConversion,
        roas,
        adAccountId: actId,
      };
    });

    const accountName = accountData.name || `Conta Meta (${actId})`;
    return {
      success: true,
      message: `Conexão efetuada com sucesso com a Meta Ads Graph API para ${accountName}! (${mappedCampaigns.length} campanhas sincronizadas).`,
      accountName,
      currency: accountData.currency || 'BRL',
      timezone: accountData.timezone_name || 'America/Sao_Paulo',
      campaigns: mappedCampaigns,
      syncedAt: new Date().toISOString(),
    };
  } catch (networkErr: any) {
    // If request fails (e.g. offline, mock token, network block)
    return {
      success: false,
      message: `Erro na requisição para a Graph API da Meta: ${networkErr.message}`,
      errorDetail: {
        message: networkErr.message,
        rawMessage: networkErr.stack || networkErr.message,
      },
    };
  }
}
