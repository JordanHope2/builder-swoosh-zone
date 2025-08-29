import amqp from 'amqplib';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function processSignupMessage(msg: amqp.ConsumeMessage | null) {
  if (msg) {
    const { email, password, userData } = JSON.parse(msg.content.toString());
    console.log(`Processing signup for ${email}`);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData },
      });
      if (error) throw error;
      console.log(`Successfully signed up ${email}`);
      // Here you would also send a welcome email
    } catch (error) {
      console.error(`Failed to sign up ${email}:`, error);
    }
  }
}

async function startWorker() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    const queue = 'signup';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Worker waiting for messages in queue: ${queue}`);

    channel.consume(queue, processSignupMessage, { noAck: true });
  } catch (error) {
    console.error('Worker failed to start:', error);
  }
}

startWorker();
