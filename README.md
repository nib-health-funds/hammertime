[![Build Status](https://travis-ci.org/nib-health-funds/hammertime.svg?branch=master)](https://travis-ci.org/nib-health-funds/hammertime)
[![codecov](https://codecov.io/gh/nib-health-funds/hammertime/branch/master/graph/badge.svg)](https://codecov.io/gh/nib-health-funds/hammertime)

# hammertime

[![Build Status](https://travis-ci.org/nib-health-funds/hammertime.svg?branch=master)](https://travis-ci.org/nib-health-funds/hammertime)

Serverless power cycling for AWS EC2, RDS instances, Auto Scaling Groups, and Fargate based on a schedule.

![Stop! Hammer Time!](hammertime.gif)

## RDS Limitations
According to [AWS RDS User Guide](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html) the following are the limitations to stopping and starting RDS instances:

One can't stop a DB instance that has a Read Replica, or that is a Read Replica.
One can't stop a DB instance that is in a Multi-AZ deployment.
One can't stop a DB instance that uses Microsoft SQL Server Mirroring.

Hammertime will automatically filter out RDS instances with the above conditions.

## Getting Started

Edit [serverless.yml](serverless.yml) where you can adjust
* scheduled run time,
* deployment s3 bucket (can be set as `DEPLOY_BUCKET` env var),
* AWS region,
* stage between dev/test/production/other (can be set as `SLICE` env var),
* anything else which takes your fancy.

## Usage

`stop-hammertime` will stop all EC2 instances that are not in an ASG, it will also set the desired instance count of all ASGs to 0; unless the mentioned assets are tagged with one of the following supported hammertime tags:

- `hammertime:canttouchthis`: Will prevent hammertime from starting or stopping this asset in all cases.
- `hammertime:canttouchthisbetween`: Will prevent hammertime from starting or stopping the asset between a given time range specified in the value of the tag. The expected format for the value is `{datetime} and {datetime}` For example: A value of `2017-05-06 and 2017-06-06` prevents hammertime from affecting this asset between the mentioned dates. The datetimes should be a valid ISO-8601 string.
- `hammertime:canttouchthisbefore`: Will prevent hammertime from affecting the asset before a specific datetime represented in the value field of the tag. The datetime should be a valid ISO-8601 string. For example: A value of `2017-05-06` will ensure the given asset is not touched before the given date.

`start-hammertime` will query the tags left by `stop-hammertime` and return the instances and ASGs to their previous status.

Hammertime is intended to be run in response to a Lambda scheduled event, e.g

`stop-hammertime`: run Monday-Sunday at 6PM (UTC timezone by default, see [here](#Changing-the-defaults) on how to customise this)

`start-hammertime`: run Monday-Sunday at 6AM (UTC timezone by default, see [here](#Changing-the-defaults) on how to customise this)

### Enabling/Disabling

You can enable/disable hammertime using the environment variable `HAMMERTIME_ENABLED` at the time of deployment. 'true' enables hammertime.

### Dry run

Hammertime has a dry-run feature for when you are not quite ready to unleash the [hammer pants](https://en.wikipedia.org/wiki/Hammer_pants) on your entire fleet of EC2s just yet.
By setting `HAMMERTIME_DRY_RUN` to 'true', you enable dry-run in which hammertime does not touch your EC2s but will still log what it _would_ have touched.

### Timezones
Hammertime can run against assets that require a different uptime schedule due to the timezone that they might operate in. Have teams that work in different timezones on their owns assets, then this festure is for you!
When deploying hammertime, set the environment variable `HAMMERTIME_OPERATING_TIMEZONES`, list any amount of valid [IANA](https://www.iana.org/time-zones) timezones, deliminated by a `,` that you would like hammertime to support, for example `Australia/Sydney,Pacific/Auckland`. A list of these can be found on [wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Hammertime will now deploy with `START` and `STOP` crons in each of the listed timezones.

Once you have hammertime configured to run with multiple CRONS, tag your assets with `hammertime:operatingtimezone`, with a value that is one of the IANA timezone strings, for the example above that would either be `Australia/Sydney` or `Pacific/Auckland`. For untagged assets, hammertime will use a default operating timezone (UTC by default, see )

## Changing the defaults

#### Changing the default start and stop hour
By default, hammertime deploys with the default start hour and stop hour set to `6` and `19` respectively to start and stop instances at `6am` and stop at `6pm`.
To change these, set the environment variables `HAMMERTIME_START_HOUR` and `HAMMERTIME_STOP_HOUR` when deploying to change the hours that hammertime will start/stop assets.

#### Changing the default timezone
By default, hammertime deploys with the default operating timezone `UTC`, this can be overidden by setting the `HAMMERTIME_DEFAULT_OPERATING_TIMEZONE` environment variable when deploying. Set this to a valid [IANA](https://www.iana.org/time-zones) timezone, for example `Australia/Sydney`.

## Limitations
Due to scheduling hammertime using AWS crons, we are unable to dynamically adjust the cron to take into account timezones that shift offsets, for example timezones that implement daylight savings time (DST). To remedy this, re-deploy hammertime when your timezone offset shifts to recreate the crons to have the updated shift in offset.

## Deployment

Refer to the [serverless framework](!https://serverless.com/) for detailed instructions, but should be as simple as

* Install dependencies

```
npm i
```

* Transpile the code

```
npm run build
```

* Authenticate with AWS via your favourite CLI

* then deploy

```
npm run deploy
```

## Built With

* [serverless framework](!https://serverless.com/)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases on this repository](https://github.com/nib-health-funds/hammertime/releases).

## Authors

* **Ian Donaldson** - *Initial work* - [Ian Donaldson](https://github.com/exidy)
* **Hailey Martin** - *Made it work* - [Hailey Martin](https://github.com/hlmartin)
* **Kurt Gardiner** - *Busy work* - [Kurt Gardiner](https://github.com/krutisfood)
* **Matthew Turner** - *Timezone support* - [Matthew Turner](https://github.com/ramesius)

See also the list of [contributors](https://github.com/nib-health-funds/hammertime/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
