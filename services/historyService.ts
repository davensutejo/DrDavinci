
import { Message, ChatSession } from '../types';
import { apiClient } from './apiClient';

export const historyService = {
  /**
   * Retrieves all chat sessions for a specific user.
   */
  async getUserData(userId: string): Promise<ChatSession[]> {
    try {
      const response: any = await apiClient.getSessions(userId);
      
      if (response.error) {
        return [];
      }

      if (response.sessions) {
        // Sort by latest update and transform dates
        return response.sessions
          .map((session: any) => ({
            ...session,
            updatedAt: session.updated_at ? new Date(session.updated_at) : new Date(),
            messages: (session.messages || []).map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              imageUrl: msg.image_url,
              timestamp: new Date(msg.timestamp),
              extractedSymptoms: msg.extracted_symptoms,
              groundingSources: msg.grounding_sources,
              results: msg.analysis_results
            }))
          }))
          .sort((a: any, b: any) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
      
      return [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Retrieves a single session by ID.
   */
  async getSession(userId: string, sessionId: string): Promise<ChatSession | undefined> {
    try {
      const response: any = await apiClient.getSession(sessionId);
      
      if (response.error) {
        return undefined;
      }

      if (response.session && response.messages) {
        return {
          id: response.session.id,
          userId: response.session.user_id,
          title: response.session.title,
          messages: response.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            imageUrl: msg.image_url,
            timestamp: new Date(msg.timestamp),
            extractedSymptoms: msg.extracted_symptoms,
            groundingSources: msg.grounding_sources,
            results: msg.analysis_results
          })),
          updatedAt: new Date(response.session.updated_at)
        };
      }
      
      return undefined;
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Saves or updates a specific session for a user.
   * Returns the session ID (either the original or newly created one)
   */
  async saveSession(userId: string, session: ChatSession): Promise<string | null> {
    try {
      // Don't save empty or new sessions that only have the welcome message
      if (session.id === 'new' && session.messages.length <= 1) {
        return null;
      }

      // Generate auto-title if needed
      let title = session.title;
      if (session.title === 'New Consultation' && session.messages.length > 1) {
        const userMessage = session.messages.find(m => m.role === 'user');
        title = userMessage?.content.substring(0, 30) + '...' || 'New Consultation';
      }

      let sessionId = session.id;

      // If session doesn't have a real ID yet, create one
      if (!sessionId || sessionId === 'new') {
        const createResponse: any = await apiClient.createSession(userId, title);
        if (createResponse.session) {
          sessionId = createResponse.session.id;
        } else {
          return null;
        }
      } else {
        // Update title if it changed
        if (title !== session.title) {
          await apiClient.updateSession(sessionId, title).catch(() => {});
        }
      }

      // Get existing messages for this session to avoid duplicates
      try {
        const existingSession = await apiClient.getSession(sessionId);
        const existingMessageIds = new Set(
          existingSession?.messages?.map((m: any) => m.id) || []
        );

        // Save only new messages
        for (const message of session.messages) {
          if (!existingMessageIds.has(message.id)) {
            await apiClient.saveMessage(
              sessionId,
              message.role,
              message.content,
              message.imageUrl,
              message.extractedSymptoms,
              message.groundingSources,
              message.results,
              message.id
            );
          }
        }
      } catch (error) {
        // If we can't get existing messages, just try to save them all
        // The API will handle duplicates
        for (const message of session.messages) {
          await apiClient.saveMessage(
            sessionId,
            message.role,
            message.content,
            message.imageUrl,
            message.extractedSymptoms,
            message.groundingSources,
            message.results,
            message.id
          );
        }
      }

      return sessionId;
    } catch (error) {
      return null;
    }
  },

  /**
   * Deletes a specific session.
   */
  async deleteSession(userId: string, sessionId: string): Promise<void> {
    try {
      await apiClient.deleteSession(sessionId);
    } catch (error) {
    }
  },

  /**
   * Clears all data for the specific user.
   */
  async clearUserData(userId: string): Promise<void> {
    try {
      await apiClient.clearUserData(userId);
    } catch (error) {
      // Clearance failed
    }
  }
};
