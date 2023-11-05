import * as cdk from "aws-cdk-lib";
import {
  CfnApplication,
  CfnApplicationVersion,
  CfnEnvironment,
} from "aws-cdk-lib/aws-elasticbeanstalk";
import * as S3Asset from "aws-cdk-lib/aws-s3-assets";

export interface EbsStackProps extends cdk.StackProps {
  dbHost: string;
  dbPort: string;
  dbName: string;
}

export class EbsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: EbsStackProps) {
    super(scope, id, props);

    // Setup environment variables for the EBS application
    // This is also where we set the environment variables for the Discord and OpenAI API keys
    const environmentVariables: Record<string, any> = {
      POSTGRES_USER: "postgres",
      POSTGRES_DB: props.dbName,
      DB_HOST: props.dbHost,
      DB_PORT: props.dbPort,
    };

    const environmentOptions = Object.keys(environmentVariables).map(
      (variable) => {
        return {
          namespace: "aws:elasticbeanstalk:application:environment",
          optionName: variable,
          value: environmentVariables[variable],
        };
      }
    );

    // App Name
    const applicationName = "discord-bot";

    // Create S3Asset for the source bundle
    const assets = new S3Asset.Asset(this, `${applicationName}-assets`, {
      path: "./dist",
      exclude: ["node_modules"],
    });

    // Create the application
    const application = new CfnApplication(this, `${applicationName}-app`, {
      applicationName,
    });

    // Create the application version
    const appVersionProps = new CfnApplicationVersion(
      this,
      `${applicationName}-version`,
      {
        applicationName,
        sourceBundle: {
          s3Bucket: assets.s3BucketName,
          s3Key: assets.s3ObjectKey,
        },
      }
    );

    // Set environment options
    const options: CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: "aws:autoscaling:launchconfiguration",
        optionName: "IamInstanceProfile",
        value: "aws-elasticbeanstalk-ec2-role",
      },
      {
        namespace: "aws:ec2:instances",
        optionName: "InstanceTypes",
        value: "t3.small",
      },
    ];

    // Create the cloudformation environment
    new CfnEnvironment(this, `${applicationName}-environment`, {
      environmentName: "develop",
      applicationName: application.applicationName ?? applicationName,
      solutionStackName: "64bit Amazon Linux 2023 v6.0.2 running Node.js 18",
      optionSettings: [...options, ...environmentOptions],
      versionLabel: appVersionProps.ref,
    });
    appVersionProps.addDependency(application);
  }
}
