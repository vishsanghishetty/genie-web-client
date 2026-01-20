import { FunctionComponent, useCallback } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td, ActionsColumn } from '@patternfly/react-table';
import { Label } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom-v5-compat';
import type { Artifact } from './types';
import { formatRelativeTime } from './utils';
import './ArtifactLibrary.css';

export interface ArtifactTableProps {
  artifacts: Artifact[];
}

export const ArtifactTable: FunctionComponent<ArtifactTableProps> = ({ artifacts }) => {
  const { t } = useTranslation('plugin__genie-web-client');
  const navigate = useNavigate();

  const handleArtifactClick = useCallback(
    (artifact: Artifact) => {
      // Navigate to canvas mode in the conversation
      if (artifact.conversationId) {
        navigate(`/genie/chat/${artifact.conversationId}`);
      }
    },
    [navigate],
  );

  const columnNames = {
    type: t('artifactLibrary.table.type'),
    name: t('artifactLibrary.table.name'),
    model: 'Model',
    messages: 'Messages',
    updated: t('artifactLibrary.table.updated'),
  };

  return (
    <Table aria-label={t('artifactLibrary.ariaLabel')} variant="compact" className="artifact-table">
      <Thead>
        <Tr>
          <Th>{columnNames.type}</Th>
          <Th width={40}>{columnNames.name}</Th>
          <Th width={20}>{columnNames.model}</Th>
          <Th width={10}>{columnNames.messages}</Th>
          <Th width={15}>{columnNames.updated}</Th>
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {artifacts.map((artifact) => (
          <Tr
            key={artifact.id}
            onClick={() => handleArtifactClick(artifact)}
            className="artifact-table__row"
          >
            <Td dataLabel={columnNames.type}>
              <Label color="blue" isCompact>
                {t(`artifactLibrary.type.${artifact.type}`)}
              </Label>
            </Td>
            <Td dataLabel={columnNames.name}>
              <strong>{artifact.title}</strong>
            </Td>
            <Td dataLabel={columnNames.model}>{artifact.model}</Td>
            <Td dataLabel={columnNames.messages}>{artifact.messageCount}</Td>
            <Td dataLabel={columnNames.updated}>{formatRelativeTime(artifact.updatedAt)}</Td>
            <Td isActionCell>
              <ActionsColumn
                items={[
                  {
                    title: 'Edit',
                    onClick: (event) => {
                      event?.stopPropagation();
                      console.log('Edit artifact', artifact.id);
                    },
                  },
                  {
                    title: 'Share',
                    onClick: (event) => {
                      event?.stopPropagation();
                      console.log('Share artifact', artifact.id);
                    },
                  },
                  {
                    isSeparator: true,
                  },
                  {
                    title: 'Delete',
                    onClick: (event) => {
                      event?.stopPropagation();
                      console.log('Delete artifact', artifact.id);
                    },
                  },
                ]}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
