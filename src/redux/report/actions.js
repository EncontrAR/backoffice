import axios from 'axios';

export const SUCCESS_CAMPAIGNS = 'SUCCESS_CAMPAIGNS'
export const ACTIVE_CAMPAIGNS = 'ACTIVE_CAMPAIGNS'
export const EXPIRED_CAMPAIGNS = 'EXPIRED_CAMPAIGNS'
export const CANCELED_CAMPAIGNS = 'CANCELED_CAMPAIGNS'
export const CLEAR = 'CLEAR'

const reportActions = {

	indexStatusCampaigns: (status, from, to, page, limit) => {
		var action = null

		switch (status) {
			case 'actived':
				action = ACTIVE_CAMPAIGNS
				break

			case 'deactivated':
				action = CANCELED_CAMPAIGNS
				break

			case 'expired':
				action = EXPIRED_CAMPAIGNS
				break

			case 'success':
				action = SUCCESS_CAMPAIGNS
				break
		}

		const body = {
			from: from,
			to: to,
			page: page,
			limit: limit,
			status: status
		}

		return (dispatch, getState) => {
	      axios.post('/admin/reports/campaign_status', body)
	      	.then((response) => dispatch({ type: action, payload: response.data }))
		}
	},

	clear: () => {
		return { type: CLEAR, payload: null }
	}
}

export default reportActions