import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db.js";
import bodyParser from "body-parser";

// routes
import authRoutes from "../api/routes/auth.route.js";
import userRoutes from "../api/routes/user.route.js";
import barangayRoutes from "../api/routes/barangay.route.js";
import beneficiaryRoutes from "../api/routes/beneficiary.route.js";
import ayudaRoutes from "../api/routes/ayuda.route.js";
import applicationRoutes from "../api/routes/application.route.js";
import goodsRoutes from "../api/routes/goods.route.js";
import distributionRoutes from "../api/routes/distribution.route.js";
import projectRoutes from "../api/routes/project.route.js";

//
import { handleError } from "./middleware/handleError.js";
import mongoose from "mongoose";
import Project from "./models/project.model.js";

// to load env
config();

const app = express();
const PORT = process.env.PORT || 500;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(handleError);

app.use(`/api/auth`, authRoutes);
app.use(`/api/user`, userRoutes);
app.use(`/api/barangay`, barangayRoutes);
app.use(`/api/beneficiary`, beneficiaryRoutes);
app.use(`/api/ayuda`, ayudaRoutes);
app.use(`/api/application`, applicationRoutes);
app.use(`/api/goods`, goodsRoutes);
app.use(`/api/distribute`, distributionRoutes);
app.use(`/api/project`, projectRoutes);

// export const fixProjectTodosIndex = async () => {
//   try {
//     console.log(
//       'ℹ️  Checking and fixing database indices for "projects" collection...'
//     );
//     const projectCollection = mongoose.connection.collection("projects");
//     const indexName = "projectTodos.title_1";

//     // 1. Find the problematic index using the Model's collection object.
//     // FIX: Changed from .listIndexes().toArray() to .indexes(), which directly returns an array.
//     const indexes = await Project.collection.indexes();
//     const problematicIndex = indexes.find((index) => index.name === indexName);

//     // 2. Only proceed if the index exists and it's not already sparse
//     if (problematicIndex && !problematicIndex.sparse) {
//       console.log(
//         `⚠️  Found non-sparse index: '${indexName}'. Attempting to fix...`
//       );

//       // 3. Attempt to drop the index with robust error handling
//       try {
//         await projectCollection.dropIndex(indexName);
//         console.log(`✅ Successfully dropped index '${indexName}'.`);
//       } catch (error) {
//         console.error(
//           `❌ Error while dropping index '${indexName}':`,
//           error.message
//         );

//         // If the error is an "index not found" error, try an alternative drop command
//         if (error.code === 27 || error.message.includes("not found")) {
//           console.log("⚠️ Trying alternative drop method via db command...");
//           try {
//             await mongoose.connection.db.command({
//               dropIndexes: "projects", // The name of the collection
//               index: indexName, // The name of the index
//             });
//             console.log(
//               "✅ Successfully dropped index using alternative method."
//             );
//           } catch (altError) {
//             console.error(
//               "❌ Failed to drop index with alternative method:",
//               altError
//             );
//             // If the alternative also fails, we should stop the process.
//             throw altError;
//           }
//         } else {
//           // For any other type of error, re-throw it.
//           throw error;
//         }
//       }

//       // 4. Recreate the index correctly with the `sparse` option
//       console.log(`Recreating '${indexName}' as a sparse index...`);
//       await projectCollection.createIndex(
//         { "projectTodos.title": 1 },
//         { unique: true, sparse: true }
//       );
//       console.log("✅ Successfully recreated sparse index.");
//     } else if (problematicIndex && problematicIndex.sparse) {
//       console.log(
//         `ℹ️  Index '${indexName}' is already sparse. No action needed.`
//       );
//     } else {
//       console.log(`ℹ️  Index '${indexName}' not found. No action needed.`);
//     }
//   } catch (error) {
//     console.error(
//       "❌ A critical error occurred during the index fix process:",
//       error
//     );
//     // Re-throw the error to stop the server startup if something goes wrong
//     throw error;
//   }
// };
// fixProjectTodosIndex();

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
  });
