import { useRef, useState, useEffect } from 'react';
import {
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotHeaderActions,
  ChatbotHeaderOptionsDropdown,
} from '@patternfly/chatbot';
import {
  ActionList,
  ActionListItem,
  Button,
  DropdownItem,
  DropdownList,
  TextInputGroup,
  TextInputGroupMain,
  Tooltip,
} from '@patternfly/react-core';
import { RhStandardThoughtBubbleIcon, CheckIcon, TimesIcon } from '@patternfly/react-icons';
import { useParams } from 'react-router-dom-v5-compat';
import { useActiveConversation } from '../../hooks/AIState';

export const EditableChatHeader: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const activeConversation = useActiveConversation();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState<string>('Chat title');
  const [error, setError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const originalTitleRef = useRef<string>(title);

  // Fetch conversation title when conversation changes
  useEffect(() => {
    if (activeConversation?.id && conversationId === activeConversation.id) {
      // Get topic summary from conversation metadata
      const topicSummary = (activeConversation as any).topic_summary || 'Chat title';
      setTitle(topicSummary);
      originalTitleRef.current = topicSummary;
    }
  }, [activeConversation, conversationId]);

  const onEditClick = () => {
    originalTitleRef.current = title;
    setIsEditing(true);
  };

  const handleInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setTitle(value);
    if (error && value.trim()) {
      setError(undefined);
    }
  };

  const saveTitle = async (newTitle: string) => {
    if (!conversationId) {
      console.error('No conversation ID available');
      return;
    }

    setIsSaving(true);
    try {
      // Call the API to update the conversation topic_summary
      const response = await fetch(`http://localhost:8080/v1/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic_summary: newTitle,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update conversation: ${response.statusText}`);
      }

      // Success! Update the original ref so cancel works correctly
      originalTitleRef.current = newTitle;
      console.log('Conversation title updated successfully');
    } catch (err) {
      console.error('Failed to update conversation title:', err);
      setError('Failed to save title. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ChatbotHeader>
      <ChatbotHeaderMain>
        <span className="chat-header-icon">
          <RhStandardThoughtBubbleIcon />
        </span>
        {isEditing ? (
          <Tooltip trigger="manual" isVisible={!!error} position="top" content={error}>
            <>
              <TextInputGroup>
                <TextInputGroupMain
                  value={title}
                  onChange={handleInputChange}
                  aria-label="Edit conversation title"
                  aria-invalid={!!error}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      const next = title.trim();
                      if (!next) {
                        setError('Title cannot be empty.');
                        return;
                      }
                      await saveTitle(next);
                      if (!error) {
                        setIsEditing(false);
                      }
                    }
                  }}
                />
              </TextInputGroup>
              <ActionList isIconList>
                <ActionListItem>
                  <Button
                    variant="plain"
                    aria-label="Cancel title edit"
                    icon={<TimesIcon />}
                    onClick={() => {
                      setIsEditing(false);
                      setTitle(originalTitleRef.current);
                      setError(undefined);
                    }}
                  />
                </ActionListItem>
                <ActionListItem>
                  <Button
                    variant="plain"
                    aria-label="Save title"
                    icon={<CheckIcon />}
                    isLoading={isSaving}
                    isDisabled={isSaving}
                    onClick={async () => {
                      const next = title.trim();
                      if (!next) {
                        setError('Title cannot be empty.');
                        return;
                      }
                      await saveTitle(next);
                      if (!error) {
                        setIsEditing(false);
                      }
                    }}
                  />
                </ActionListItem>
              </ActionList>
            </>
          </Tooltip>
        ) : (
          <Button
            variant="plain"
            isInline
            onClick={onEditClick}
            aria-label="Edit conversation title"
          >
            {title}
          </Button>
        )}
      </ChatbotHeaderMain>
      <ChatbotHeaderActions>
        {!isEditing && (
          <ChatbotHeaderOptionsDropdown
            isCompact
            tooltipProps={{ content: 'More actions' }}
            toggleProps={{ 'aria-label': 'kebab dropdown toggle', isDisabled: false }}
          >
            <DropdownList>
              <DropdownItem value="rename" onClick={onEditClick}>
                Rename
              </DropdownItem>
            </DropdownList>
          </ChatbotHeaderOptionsDropdown>
        )}
      </ChatbotHeaderActions>
    </ChatbotHeader>
  );
};

export default EditableChatHeader;
