import { FastifyPluginAsync } from 'fastify';
import { Readable } from 'stream';
import { getNextService } from '../../services';
import type { ChatMessage } from '../../types';

const chat: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', async (request, reply) => {
    const { messages } = request.body as { messages: ChatMessage[] };
    
    if (!messages) {
      return reply.status(400).send({ error: 'Messages are required' });
    }
  
    const service = getNextService();
  
    request.log.info(`Using ${service?.name} service`);
  
    try {
      const stream = await service?.chat(messages);
  
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');
  
      // Create a readable stream from the async generator
      const readableStream = Readable.from(stream);
      
      return reply.send(readableStream);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};

export default chat;
