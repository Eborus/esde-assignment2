// Import controlers
const { verify } = require('crypto');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const verifyUserFn = require('./middlewares/verifyUserFn');

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', authController.processLogin);
    router.post('/api/user/register', authController.processRegister);
    router.post('/api/user/process-submission', checkUserFn.getClientUserId, verifyUserFn.verifyUser, userController.processDesignSubmission);
    router.put('/api/user/', verifyUserFn.verifyAdmin, userController.processUpdateOneUser);
    router.put('/api/user/design/', verifyUserFn.verifyUser, userController.processUpdateOneDesign);

    router.get('/api/user/process-search-design/:pagenumber/:search?', checkUserFn.getClientUserId, verifyUserFn.verifyUser, userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?', checkUserFn.getClientUserId, verifyUserFn.verifyAdmin, userController.processGetUserData);
    router.get('/api/user/:recordId', userController.processGetOneUserData);
    router.get('/api/user/design/:fileId', verifyUserFn.verifyUser, userController.processGetOneDesignData);

};