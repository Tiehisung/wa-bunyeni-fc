// import { MongoClient } from 'mongodb'
// import { NextResponse } from "next/server";

// const sourceURI =
//     'mongodb+srv://example:name@cluster0.xkh1kir.mongodb.net/KONJIEHIFC?retryWrites=true&w=majority'

// const targetURI = process.env.MDB_URI as string

// /**
//  * Migrate entire database from one project cluster to another
//  * @returns 
//  */

// export async function GET() {

//     const sourceClient = new MongoClient(sourceURI)
//     const targetClient = new MongoClient(targetURI)

//     try {
//         await sourceClient.connect()
//         await targetClient.connect()

//         const sourceDB = sourceClient.db('KONJIEHIFC')
//         const targetDB = targetClient.db('KONJIEHIFC')

//         const collections = await sourceDB.listCollections().toArray()
//         const summary: Record<string, number> = {}

//         for (const { name } of collections) {
//             const data = await sourceDB.collection(name).find({}).toArray()

//             if (data.length > 0) {
//                 await targetDB.collection(name).deleteMany({}) // optional: clear old data
//                 await targetDB.collection(name).insertMany(data)
//                 summary[name] = data.length
//                 console.log(`✅ Migrated ${data.length} documents from ${name}`)
//             }
//         }

//         return NextResponse.json({
//             ok: true,
//             message: '🎉 Migration complete!',
//             migratedCollections: summary,
//         })
//     } catch (error: any) {
//         console.error('❌ Migration failed:', error)
//         return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
//     } finally {
//         await sourceClient.close()
//         await targetClient.close()
//     }
// }
