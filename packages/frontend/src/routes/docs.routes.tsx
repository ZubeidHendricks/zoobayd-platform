import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import DocsLayout from '../components/layouts/DocsLayout';
import DocsHomePage from '../pages/docs';

import GraphQLAPI from '../pages/docs/api/graphql';
import RestAPI from '../pages/docs/api/rest';
import WebSocketAPI from '../pages/docs/api/websocket';
import AdvancedConfig from '../pages/docs/configuration/advanced';
import GasOptimization from '../pages/docs/configuration/gas';
import NetworkSettings from '../pages/docs/configuration/network';
import BasicConcepts from '../pages/docs/getting-started/basics';
import Installation from '../pages/docs/getting-started/installation';
import QuickStart from '../pages/docs/getting-started/quickstart';
import AuditReports from '../pages/docs/security/audit';
import BestPractices from '../pages/docs/security/best-practices';
import SecurityAnalysis from '../pages/docs/security/analysis';
import AIGeneration from '../pages/docs/smart-contracts/ai';
import ContractTemplates from '../pages/docs/smart-contracts/templates';

const DocsLayoutWrapper = () => (
  <DocsLayout>
    <Outlet />
  </DocsLayout>
);

export const docsRoutes: RouteObject[] = [
  {
    path: 'docs',
    element: <DocsLayoutWrapper />,
    children: [
      { index: true, element: <DocsHomePage /> },
      { path: 'api/graphql', element: <GraphQLAPI /> },
      { path: 'api/rest', element: <RestAPI /> },
      { path: 'api/websocket', element: <WebSocketAPI /> },
      { path: 'configuration/advanced', element: <AdvancedConfig /> },
      { path: 'configuration/gas', element: <GasOptimization /> },
      { path: 'configuration/network', element: <NetworkSettings /> },
      { path: 'getting-started/basics', element: <BasicConcepts /> },
      { path: 'getting-started/installation', element: <Installation /> },
      { path: 'getting-started/quickstart', element: <QuickStart /> },
      { path: 'security/audit', element: <AuditReports /> },
      { path: 'security/best-practices', element: <BestPractices /> },
      { path: 'security/analysis', element: <SecurityAnalysis /> },
      { path: 'smart-contracts/ai', element: <AIGeneration /> },
      { path: 'smart-contracts/templates', element: <ContractTemplates /> },
    ],
  },
];