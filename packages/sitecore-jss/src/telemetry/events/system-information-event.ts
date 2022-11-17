﻿import { execSync } from 'child_process';
import os from 'os';
import { TelemetryEventInitializer } from './base-event';

interface SystemInformationEventIncomingAttrs {
  nodeVersion: string;
  npmVersion: string;
  platform: string;
}

export const SystemInformationTelemetryEvent = (): TelemetryEventInitializer<SystemInformationEventIncomingAttrs> => () => {
  const nodeVersion = process.versions.node;
  const npmVersion = execSync('npm --version')
    .toString()
    .replace(/\r|\n/g, '');
  const platform = os.platform();

  return {
    type: 'SystemInformation',
    attrs: {
      nodeVersion,
      npmVersion,
      platform,
    },
  };
};