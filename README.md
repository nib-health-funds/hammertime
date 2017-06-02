[![Build Status](https://travis-ci.org/nib-health-funds/hammertime.svg?branch=master)](https://travis-ci.org/nib-health-funds/hammertime)

# hammertime

Serverless power cycling for AWS EC2 instances and Auto Scaling Groups based on a schedule.

![Stop! Hammer Time!](hammertime.gif)

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
- `hammertime:canttouchthisbetween`: Will prevent hammertime from starting or stopping the asset between a given UTC date range specified in the value of the tag. The expected format for the value is `YYYY-MM-DD and YYYY-MM-DD` For example: A value of `2017-05-06 and 2017-06-06` prevents hammertime from affecting this asset between the mentioned dates.
- `hammertime:canttouchthisbefore`: Will prevent hammertime from affecting the asset before a specific UTC date represented in the value field of the tag. The expected date format is: `YYYY-MM-DD`. For example: A value of `2017-05-06` will ensure the given asset is not touched before the given date.

`start-hammertime` will query the tags left by `stop-hammertime` and return the instances and ASGs to their previous status.

Hammertime is intended to be run in response to a Lambda scheduled event, e.g

`stop-hammertime`: run Monday-Friday at 6PM
`start-hammertime`: run Monday-Friday at 6AM

Note when constructing schedule events in AWS, that times are in UTC.

### Enabling/Disabling

You can enable/disable hammertime using the environment variable `HAMMERTIME_ENABLED` at the time of deployment. 'true' enables hammertime.

### Dry run

Hammertime has a dry-run feature for when you are not quite ready to unleash the [hammer pants](https://en.wikipedia.org/wiki/Hammer_pants) on your entire fleet of EC2s just yet.
By setting `HAMMERTIME_DRY_RUN` to 'true', you enable dry-run in which hammertime does not touch your EC2s but will still log what it _would_ have touched.

## Deployment

Refer to the [serverless framework](!https://serverless.com/) for detailed instructions, but should be as simple as

* Install dependencies

```
npm i
```

* Authenticate with AWS via your favourite CLI

* then deploy

```
npm deploy
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

See also the list of [contributors](https://github.com/nib-health-funds/hammertime/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
