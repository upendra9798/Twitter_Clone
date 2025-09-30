import connectMongoDB from './connectMongoDB.js';
import { createDatabaseIndexes, listAllIndexes, dropAllCustomIndexes } from './createIndexes.js';

// Command line script for index management
const command = process.argv[2];

const runIndexCommand = async () => {
  try {
    await connectMongoDB();
    
    switch (command) {
      case 'create':
        console.log('🔍 Creating all database indexes...');
        await createDatabaseIndexes();
        break;
        
      case 'list':
        console.log('📋 Listing all database indexes...');
        await listAllIndexes();
        break;
        
      case 'drop':
        console.log('🗑️ Dropping all custom indexes...');
        await dropAllCustomIndexes();
        break;
        
      case 'recreate':
        console.log('🔄 Recreating all indexes...');
        await dropAllCustomIndexes();
        await createDatabaseIndexes();
        break;
        
      default:
        console.log(`
Usage: node indexManager.js <command>

Commands:
  create    - Create all database indexes
  list      - List all existing indexes  
  drop      - Drop all custom indexes
  recreate  - Drop and recreate all indexes

Examples:
  node backend/db/indexManager.js create
  node backend/db/indexManager.js list
  node backend/db/indexManager.js drop
  node backend/db/indexManager.js recreate
        `);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Index management error:', error);
    process.exit(1);
  }
};

runIndexCommand();