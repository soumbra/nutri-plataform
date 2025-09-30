"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Rotas
const auth_1 = __importDefault(require("./routes/auth"));
const nutritionist_1 = __importDefault(require("./routes/nutritionist"));
const contracts_1 = __importDefault(require("./routes/contracts"));
const meal_plans_1 = __importDefault(require("./routes/meal-plans"));
const foods_1 = __importDefault(require("./routes/foods"));
const progress_1 = __importDefault(require("./routes/progress"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
// CORS configuration for production
const corsOptions = {
    origin: NODE_ENV === 'production'
        ? [
            'https://your-app-name.vercel.app', // Substituir pela URL real do Vercel
            'https://*.vercel.app'
        ]
        : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rotas
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Nutri Platform API is running!' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/nutritionists', nutritionist_1.default);
app.use('/api/contracts', contracts_1.default);
app.use('/api/meal-plans', meal_plans_1.default);
app.use('/api/foods', foods_1.default);
app.use('/api/progress', progress_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map