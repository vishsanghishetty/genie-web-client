import { FunctionComponent, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Flex,
  FlexItem,
  Gallery,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom-v5-compat';
import type { Artifact } from './types';
import { formatRelativeTime } from './utils';
import './ArtifactLibrary.css';

export interface ArtifactGridProps {
  artifacts: Artifact[];
}

export const ArtifactGrid: FunctionComponent<ArtifactGridProps> = ({ artifacts }) => {
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

  return (
    <Gallery hasGutter minWidths={{ default: '280px' }} className="artifact-grid">
      {artifacts.map((artifact) => (
        <Card
          key={artifact.id}
          isClickable
          onClick={() => handleArtifactClick(artifact)}
          className="artifact-card"
        >
          <CardHeader
            actions={{
              actions: (
                <Dropdown
                  onSelect={() => {
                    // Handle action selection
                  }}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="plain"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label={t('artifactLibrary.table.actions')}
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  isOpen={false}
                  onOpenChange={() => {
                    // Handle dropdown state
                  }}
                >
                  <DropdownList>
                    <DropdownItem key="edit">Edit</DropdownItem>
                    <DropdownItem key="share">Share</DropdownItem>
                    <DropdownItem key="delete" isDanger>
                      Delete
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              ),
              hasNoOffset: false,
            }}
          >
            <Label color="blue" isCompact>
              {t(`artifactLibrary.type.${artifact.type}`)}
            </Label>
          </CardHeader>
          <CardTitle>{artifact.title}</CardTitle>
          <CardBody className="artifact-card__body">
            {/* Description would go here if available from API */}
          </CardBody>
          <CardFooter>
            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem className="artifact-card__metadata">
                {artifact.messageCount} {artifact.messageCount === 1 ? 'message' : 'messages'}
              </FlexItem>
              <FlexItem className="artifact-card__metadata">•</FlexItem>
              <FlexItem className="artifact-card__metadata">{artifact.model}</FlexItem>
              <FlexItem className="artifact-card__metadata">•</FlexItem>
              <FlexItem className="artifact-card__timestamp">
                {formatRelativeTime(artifact.updatedAt)}
              </FlexItem>
            </Flex>
          </CardFooter>
        </Card>
      ))}
    </Gallery>
  );
};
