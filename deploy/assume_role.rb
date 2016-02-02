require 'aws-sdk'
require_relative 'nib_artifacts.rb'

class AssumeRole

  def initialize
    nib_aws_map = NibArtifacts.new.load_map
    @environment = ENV['ENVIRONMENT']
    raise 'you must specific ENVIRONMENT to use STS assume role' if @environment.nil?
    @nib_aws_account_map = nib_aws_map[@environment]
    raise 'Unable to determine details' if @nib_aws_account_map['deployer_role_arn'].nil?
  end

  def set_credentials!
    AWS.config(get_sts_credentials)
  end

  private

  def get_sts_credentials
    ec2_provider = AWS::Core::CredentialProviders::EC2Provider.new
    if ec2_provider.set?
      sts = AWS::STS.new(credential_provider: ec2_provider)
      response = sts.assume_role(
          duration_seconds: 60 * 60,
          role_arn: @nib_aws_account_map['deployer_role_arn'],
          role_session_name: 'deployment-session',
          external_id: 'cross-acccount-access'
      )
      response[:credentials]
    else
      {}
    end
  end
end
