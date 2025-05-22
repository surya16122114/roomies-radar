import chatRouter from "./chat-router.js";
import RegisterUser from './User-routes.js';
import membershipRoutes from './membershipRoutes.js';
import postsRoutes from './posts.js';
// Initialize routes for the application
const initializeRoutes = (app) => {
    app.use("/chats", chatRouter); // Register chat routes under the "/chats" path
    app.use('/', RegisterUser); // Register user routes under the "/auth" path
    app.use('/memberships', membershipRoutes);
    app.use('/posts', postsRoutes); 
};

export default initializeRoutes;
