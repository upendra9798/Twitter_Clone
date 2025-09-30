import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import { Notification } from '../models/notification.model.js';

export const createDatabaseIndexes = async () => {
  try {
    console.log('🔍 Creating MongoDB indexes...');

    // ============================================
    // USER COLLECTION INDEXES
    // ============================================
    
    // 1. Username index (unique) - for login & profile lookup
    await User.collection.createIndex(
      { username: 1 }, 
      { 
        unique: true,
        name: 'username_unique_idx'
      }
    );
    
    // 2. Email index (unique) - for signup & authentication
    await User.collection.createIndex(
      { email: 1 }, 
      { 
        unique: true,
        name: 'email_unique_idx'
      }
    );
    
    // 3. Followers array index - for follower queries
    await User.collection.createIndex(
      { followers: 1 },
      { name: 'followers_idx' }
    );
    
    // 4. Following array index - for following queries
    await User.collection.createIndex(
      { following: 1 },
      { name: 'following_idx' }
    );
    
    // 5. Creation date index - for user analytics
    await User.collection.createIndex(
      { createdAt: -1 },
      { name: 'user_created_desc_idx' }
    );

    // ============================================
    // POST COLLECTION INDEXES
    // ============================================
    
    // 1. User + Creation time compound index - for user's posts timeline
    await Post.collection.createIndex(
      { user: 1, createdAt: -1 },
      { name: 'user_posts_timeline_idx' }
    );
    
    // 2. Creation time index - for global feed (getAllPosts)
    await Post.collection.createIndex(
      { createdAt: -1 },
      { name: 'posts_timeline_idx' }
    );
    
    // 3. Likes array index - for liked posts queries
    await Post.collection.createIndex(
      { likes: 1 },
      { name: 'post_likes_idx' }
    );
    
    // 4. User index - for getUserPosts query
    await Post.collection.createIndex(
      { user: 1 },
      { name: 'post_user_idx' }
    );
    
    // 5. Text search index - for future search functionality
    await Post.collection.createIndex(
      { text: 'text' },
      { 
        name: 'post_text_search_idx',
        default_language: 'english'
      }
    );

    // ============================================
    // NOTIFICATION COLLECTION INDEXES
    // ============================================
    
    // 1. Recipient + Creation time compound index - for user notifications
    await Notification.collection.createIndex(
      { to: 1, createdAt: -1 },
      { name: 'notification_recipient_timeline_idx' }
    );
    
    // 2. Sender index - for notification analytics
    await Notification.collection.createIndex(
      { from: 1 },
      { name: 'notification_sender_idx' }
    );
    
    // 3. Read status + recipient compound index - for unread notifications
    await Notification.collection.createIndex(
      { to: 1, read: 1 },
      { name: 'notification_read_status_idx' }
    );
    
    // 4. Type + recipient compound index - for notification filtering
    await Notification.collection.createIndex(
      { to: 1, type: 1 },
      { name: 'notification_type_filter_idx' }
    );

    console.log('✅ All MongoDB indexes created successfully!');
    
    // List all indexes for verification
    await listAllIndexes();
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
};

// Function to list all existing indexes
export const listAllIndexes = async () => {
  try {
    console.log('\n📋 Current Database Indexes:');
    
    const userIndexes = await User.collection.getIndexes();
    console.log('\n👤 User Collection Indexes:');
    Object.keys(userIndexes).forEach(indexName => {
      console.log(`  - ${indexName}:`, userIndexes[indexName]);
    });
    
    const postIndexes = await Post.collection.getIndexes();
    console.log('\n📝 Post Collection Indexes:');
    Object.keys(postIndexes).forEach(indexName => {
      console.log(`  - ${indexName}:`, postIndexes[indexName]);
    });
    
    const notificationIndexes = await Notification.collection.getIndexes();
    console.log('\n🔔 Notification Collection Indexes:');
    Object.keys(notificationIndexes).forEach(indexName => {
      console.log(`  - ${indexName}:`, notificationIndexes[indexName]);
    });
    
  } catch (error) {
    console.error('Error listing indexes:', error);
  }
};

// Function to drop all custom indexes (for testing)
export const dropAllCustomIndexes = async () => {
  try {
    console.log('🗑️ Dropping all custom indexes...');
    
    // Drop User indexes (except _id)
    const userIndexes = await User.collection.getIndexes();
    for (const indexName of Object.keys(userIndexes)) {
      if (indexName !== '_id_') {
        await User.collection.dropIndex(indexName);
        console.log(`Dropped User index: ${indexName}`);
      }
    }
    
    // Drop Post indexes (except _id)
    const postIndexes = await Post.collection.getIndexes();
    for (const indexName of Object.keys(postIndexes)) {
      if (indexName !== '_id_') {
        await Post.collection.dropIndex(indexName);
        console.log(`Dropped Post index: ${indexName}`);
      }
    }
    
    // Drop Notification indexes (except _id)
    const notificationIndexes = await Notification.collection.getIndexes();
    for (const indexName of Object.keys(notificationIndexes)) {
      if (indexName !== '_id_') {
        await Notification.collection.dropIndex(indexName);
        console.log(`Dropped Notification index: ${indexName}`);
      }
    }
    
    console.log('✅ All custom indexes dropped successfully!');
    
  } catch (error) {
    console.error('❌ Error dropping indexes:', error);
    throw error;
  }
};

export default createDatabaseIndexes;