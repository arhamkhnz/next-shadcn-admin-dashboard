import { Notification } from "../notification-components";

// Mock data for notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "purchase",
    title: "New Purchase",
    description: "John Smith purchased Premium Plan",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    isRead: false,
    isPriority: true,
    user: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "/avatars/arhamkhnz.png",
    },
    metadata: {
      amount: 99.99,
      plan: "Premium Annual",
      paymentMethod: "Credit Card",
    },
  },
  {
    id: "2",
    type: "alert",
    title: "Performance Alert",
    description: "API response time exceeded threshold",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    isRead: false,
    isPriority: true,
    metadata: {
      endpoint: "/api/analytics",
      responseTime: "2.5s",
      threshold: "1.0s",
    },
  },
];
