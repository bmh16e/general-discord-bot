#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EbsStackProps, EbsStack } from "../lib/ebs-stack";
import { RdsStack } from "../lib/rds-stack";
import { VpcStack } from "../lib/vpc-stack";

const envStackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
};

const app = new cdk.App();

const vpcStack = new VpcStack(app, "VpcStack", { ...envStackProps });
const vpc = vpcStack.vpc;

const rdsStack = new RdsStack(app, "RdsStack", {
  ...envStackProps,
  vpc,
});

const dbInstance = rdsStack.rdsInstance;

const ebsEnvironment: EbsStackProps = {
  ...envStackProps,
  dbName: "postgres",
  dbHost: dbInstance.instanceEndpoint.hostname.toString(),
  dbPort: "5432",
};

new EbsStack(app, "EbsStack", ebsEnvironment);
