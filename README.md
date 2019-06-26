| NOTE: The service we used for cryptocurrency mining (Coinhive) for this website shut down, so this no longer works. |
| --- |

# zfaucet
Simple Zcash(ZEC) faucet built with Node.

[![Build Status](https://travis-ci.org/ovsoinc/zfaucet.svg?branch=master)](https://travis-ci.org/ovsoinc/zfaucet)
[![Coverage Status](https://coveralls.io/repos/github/ovsoinc/zfaucet/badge.svg?branch=master)](https://coveralls.io/github/ovsoinc/zfaucet?branch=master)
[![License](https://img.shields.io/badge/license-AGPLv3-blue.svg?label=license)](https://github.com/Storj/ovsoinc/zfaucet/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/ovsoinc/zfaucet.svg)](https://github.com/ovsoinc/zfaucet/graphs/contributors)
[![dependencies Status](https://david-dm.org/ovsoinc/zfaucet/status.svg)](https://david-dm.org/ovsoinc/zfaucet)
[![devDependencies Status](https://david-dm.org/ovsoinc/zfaucet/dev-status.svg)](https://david-dm.org/ovsoinc/zfaucet?type=dev)

## DB and Zcash Setup

#### Install [Zcash](https://z.cash/)
Use the [Zcash Debian binary packages](https://github.com/zcash/zcash/wiki/Debian-binary-packages) install guide. The [Zcash 1.0 User Guide](https://github.com/zcash/zcash/wiki/1.0-User-Guide) has additional information if needed. You will have to fully sync the node before you can send any payments.
```bash
sudo apt-get install apt-transport-https
wget -qO - https://apt.z.cash/zcash.asc | sudo apt-key add -
echo "deb [arch=amd64] https://apt.z.cash/ jessie main" | sudo tee /etc/apt/sources.list.d/zcash.list
sudo apt-get update && sudo apt-get install zcash
```

#### Install [Redis](https://redis.io/)
```bash
wget http://download.redis.io/releases/redis-4.0.9.tar.gz
tar xzf redis-4.0.9.tar.gz
cd redis-4.0.9
make
src/redis-server
```

## Install & Run
Clone the repo.

```bash
git clone https://github.com/ovsoinc/zfaucet
cd ~/zfaucet
npm install
```

Save this under `~/zfaucet/.env`.

```bash
RPCUSER=[Zcash RPC Username]
RPCPASS=[Zcash RPC Password]
PORT=[Webserver Port]
COINHIVEPUBKEY=[Coinhive Public Key]
COINHIVEPRIVKEY=[Coinhive Private Key]
WITHDRAWTHRESHOLD=[Coinhive Hashes Needed to Withdraw]
```

Run with [PM2](http://pm2.keymetrics.io/).

```bash
npm install pm2 -g
pm2 start process.json
```

#### Code Update Script
We run this as a crontab ```*/5 * * * * ~/script.sh``` every 5 minutes.
```bash
#!/usr/bin/env sh
cd ~/zfaucet
git fetch && git reset --hard origin/master
```

### External API Admin tool

#### Create a new key

```
node admin external new-key
```

#### List keys

```
node admin external list-keys
```

##  Contributors (:clap:)
|  [![super3](https://avatars3.githubusercontent.com/u/60975?v=4&s=80)](https://github.com/super3) | [![montyanderson](https://avatars0.githubusercontent.com/u/3048503?v=4&s=80)](https://github.com/montyanderson) | [![marktellez](https://avatars0.githubusercontent.com/u/22487431?v=4&s=80)](https://github.com/marktellez)  |
| :--:|:--:|:--: |
|  [super3](https://github.com/super3) | [montyanderson](https://github.com/montyanderson) | [marktellez](https://github.com/marktellez)  |
