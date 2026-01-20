import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  Button,
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import {
  RhUiCollectionIcon,
  RhUiAiExperienceIcon,
  RhUiRefreshIcon,
  FilterIcon,
  ThIcon,
  ListIcon,
} from '@patternfly/react-icons';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import { useTranslation } from 'react-i18next';
import type { Artifact, ViewMode, ConversationsListResponse } from './types';
import { ArtifactGrid } from './ArtifactGrid';
import { ArtifactTable } from './ArtifactTable';
import { MOCK_CONVERSATIONS, conversationToArtifact } from './mockData';
import './ArtifactLibrary.css';

const VIEW_MODE_STORAGE_KEY = 'genie-artifact-library-view-mode';
const USE_MOCK_DATA = true; // Toggle to switch between mock and real API

export const artifactApi = {
  async fetchArtifacts(): Promise<Artifact[]> {
    if (USE_MOCK_DATA) {
      // Use mock data for development
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CONVERSATIONS.map(conversationToArtifact);
    }

    // Real API call
    const response = await fetch('http://localhost:8080/v1/conversations');
    if (!response.ok) {
      throw new Error(`Failed to fetch artifacts: ${response.statusText}`);
    }
    const data: ConversationsListResponse = await response.json();
    return data.conversations.map(conversationToArtifact);
  },
};

export const ArtifactLibrary = () => {
  const { t } = useTranslation('plugin__genie-web-client');

  // View mode state - defaults to grid view, persisted to localStorage
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return (stored === 'grid' || stored === 'list' ? stored : 'grid') as ViewMode;
  });

  // Search state
  const [searchValue, setSearchValue] = useState('');

  // Temporary fetch wiring; will be replaced when API is finalized
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const retryRef = useRef<HTMLButtonElement>(null);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  }, []);

  const refreshArtifacts = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await artifactApi.fetchArtifacts();
      setArtifacts(result || []);
      setIsError(false);
    } catch (error) {
      console.error('Failed to fetch artifacts:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshArtifacts();
  }, []);

  useEffect(() => {
    if (isError) {
      retryRef.current?.focus();
    }
  }, [isError]);

  // error state
  if (!isLoading && isError) {
    return (
      <Bullseye>
        <div className="artifact-library-error" role="alert">
          <ErrorState
            titleText={t('artifactLibrary.error.heading')}
            bodyText={t('artifactLibrary.error.description')}
            customFooter={
              <Button
                ref={retryRef}
                autoFocus
                variant="primary"
                icon={<RhUiRefreshIcon />}
                onClick={() => void refreshArtifacts()}
              >
                {t('artifactLibrary.error.retry')}
              </Button>
            }
          />
        </div>
      </Bullseye>
    );
  }

  // empty state - no artifacts saved yet
  if (!isLoading && artifacts.length === 0) {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.lg}>
          {/* TODO: Add branded thumbnail graphic/icon above text when provided by design team */}
          <div className="pf-v6-u-mb-md">
            <Label icon={<RhUiCollectionIcon />}>{t('artifactLibrary.ariaLabel')}</Label>
          </div>
          <h1 className="pf-v6-u-font-size-2xl pf-v6-u-mb-md">
            {t('artifactLibrary.emptyState.heading')}
          </h1>
          <EmptyStateBody className="pf-v6-u-font-size-md">
            {t('artifactLibrary.emptyState.description')}
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button
                variant="primary"
                icon={<RhUiAiExperienceIcon />}
                onClick={() => console.log('Create dashboard clicked')}
              >
                {t('artifactLibrary.emptyState.primaryCta')}
              </Button>
              <Button
                variant="secondary"
                icon={<RhUiAiExperienceIcon />}
                onClick={() => console.log('Code config file clicked')}
              >
                {t('artifactLibrary.emptyState.secondaryCta')}
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </Bullseye>
    );
  }

  // Filter artifacts based on search
  const filteredArtifacts = artifacts.filter((artifact) => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      artifact.title.toLowerCase().includes(searchLower) ||
      artifact.description.toLowerCase().includes(searchLower) ||
      artifact.model.toLowerCase().includes(searchLower)
    );
  });

  // Populated state with grid/list view
  return (
    <div className="artifact-library">
      {/* Toolbar with search, filters, view toggle, and new button */}
      <Toolbar id="artifact-library-toolbar" className="artifact-library__toolbar">
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              aria-label={t('artifactLibrary.searchPlaceholder')}
              placeholder={t('artifactLibrary.searchPlaceholder')}
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button variant="plain" icon={<FilterIcon />}>
                {t('artifactLibrary.filters')}
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <ToggleGroup aria-label={t('artifactLibrary.ariaLabel')}>
                <ToggleGroupItem
                  icon={<ThIcon />}
                  aria-label={t('artifactLibrary.viewToggle.grid')}
                  buttonId="grid-view"
                  isSelected={viewMode === 'grid'}
                  onChange={() => handleViewModeChange('grid')}
                />
                <ToggleGroupItem
                  icon={<ListIcon />}
                  aria-label={t('artifactLibrary.viewToggle.list')}
                  buttonId="list-view"
                  isSelected={viewMode === 'list'}
                  onChange={() => handleViewModeChange('list')}
                />
              </ToggleGroup>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary">{t('artifactLibrary.new')}</Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      {/* Render appropriate view based on view mode */}
      <div className="artifact-library__content">
        {viewMode === 'grid' ? (
          <ArtifactGrid artifacts={filteredArtifacts} />
        ) : (
          <ArtifactTable artifacts={filteredArtifacts} />
        )}
      </div>
    </div>
  );
};
