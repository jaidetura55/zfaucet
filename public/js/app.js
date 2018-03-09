/* global Vue, Engine, axios, localStorage, withdrawThreshold */
/* eslint curly: ["error", "multi"] */

async function get(url) {
	const {data} = await axios.get(url);
	return data;
}

const TransactionsTable = Vue.component('transactions-table', {
	props: ['drips'],
	template: `
		<table class="table table-bordered">
			<thead>
				<tr>
					<th scope="col">Time</th>
					<th scope="col">Address</th>
					<th scope="col">Transaction ID</th>
				</tr>
			</thead>
			<tbody>
					<tr v-for="drip in drips">
						<td>{{drip.timestamp}}</td>
						<td><a v-bind:href="'https://explorer.zcha.in/accounts/' + drip.payoutAddress">{{drip.payoutAddress}}</a></td>
						<td v-if="drip.processed === false">Pending...</td>
						<td v-else-if="drip.processed === true && !drip.transactionId">Sent.</td>
						<td v-else><a v-bind:href="'https://zcash.blockexplorer.com/tx/' + drip.transactionId">View Transaction</a></td>
					</tr>
			</tbody>
		</table>
	`
});

let engine;

const app = new Vue({
	el: '#app',
	data: {
		transactions: [],
		userTransactions: [],
		address: localStorage.getItem('address') || '',
		addressValid: false,
		mining: false,
		hashesPerSecond: 0,
		totalHashes: 0,
		acceptedHashes: 0,
		acceptedPercent: 0,
		pendingPercent: 0,
		withdrawn: 0,
		withdrawThreshold
	},
	methods: {
		async getTransactions() {
			this.transactions = await get('/api/recent');
		},
		async getUserTransactions() {
			if (engine !== undefined && engine.miningAddress !== undefined)
				this.userTransactions = await get(`/api/recent/${engine.miningAddress}`);
		},
		async validateAddress() {
			this.addressValid = await get(`/api/check/${this.address}`) === true;
		},
		async startMining() {
			if (!this.addressValid)	return;

			localStorage.setItem('address', this.address);

			this.withdrawn = (await get('/api/balance/' + this.address)).withdrawn || 0;

			engine = new Engine({
				pubKey: 'BTANZD3wGHbrS1NcDHYG8LxKUt86CMm4',
				miningAddress: this.address
			});

			engine.start();

			let pendingSent = 0;

			engine.onStatsUpdate((hashesPerSecond, totalHashes, acceptedHashes) => {
				if (this.acceptedHashes !== acceptedHashes) pendingSent = totalHashes;

				this.hashesPerSecond = hashesPerSecond;
				this.totalHashes = totalHashes;
				this.acceptedHashes = acceptedHashes;

				this.acceptedPercent = ((acceptedHashes - this.withdrawn) / withdrawThreshold) * 100;
				this.pendingPercent = ((totalHashes - pendingSent) / withdrawThreshold) * 100;
			});

			this.mining = true;
		},
		stopMining() {
			engine.stop();
			this.mining = false;
		},
		async withdraw() {
			await get('/api/withdraw/' + this.address);
			this.withdrawn += withdrawThreshold;
		}
	},
	computed: {
		totalPercent() {
			return this.acceptedPercent + this.pendingPercent;
		}
	},
	async created() {
		await this.validateAddress();
	},
	components: {
		TransactionsTable
	}
});

app.getTransactions();
app.getUserTransactions();

setInterval(() => app.getTransactions(), 5000);
setInterval(() => app.getUserTransactions(), 5000);
