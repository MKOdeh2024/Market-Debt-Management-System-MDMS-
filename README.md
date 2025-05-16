# Market Debt Management System (MDMS)

## Overview
The Market Debt Management System (MDMS) is a comprehensive web-based application designed for small to medium-sized businesses to efficiently manage customer debts, credit transactions, and payment tracking.

## Features
- 👥 Customer Management
- 💰 Debt Tracking
- 📊 Reports & Analytics
- 🔔 Notifications System
- 🏪 Multi-shop Support
- 📱 Mobile Responsive
- 🔒 Secure Authentication
- 📈 Real-time Updates

## Tech Stack
- **Frontend**: React.js, Tailwind CSS and typescript
- **Backend**: Node.js, Express.js and TypeORM
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Deployment**: Vercel (Frontend), Heroku (Backend)
- **Additional Tools**: Twilio (SMS), SendGrid (Email)

## Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm >= 9.x

## Project Structure
```
mdms/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
├── server/                # Backend Node.js application
│   ├── src/              # Source files
│   ├── config/           # Configuration files
│   └── tests/            # Test files
└── docs/                 # Documentation
```

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mdms.git
cd mdms
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Set up environment variables:
- Copy `.env.example` to `.env` in both client and server directories
- Update the variables with your configuration

5. Start the development servers:

Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd server
npm run dev
```


## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, email support@mdms.com or open an issue in the repository.