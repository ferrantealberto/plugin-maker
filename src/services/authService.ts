// In a real application, this would connect to a backend API
// For now, we'll simulate authentication with localStorage

interface User {
  id: string;
  email: string;
  name: string;
}

// Demo users for testing
const demoUsers = [
  {
    id: 'superadmin',
    email: 'wepyit@gmail.com',
    name: 'Super Admin',
    password: 'Albynet@1969',
    role: 'admin'
  },
  {
    id: 'admin',
    email: 'admin',
    name: 'Super Admin',
    password: 'Albynet@1969',
    role: 'admin'
  },
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Utente Demo',
    password: 'password123',
    role: 'user'
  }
];

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = demoUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Credenziali non valide');
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    role: user.role
  };
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (demoUsers.some(u => u.email === email)) {
    throw new Error('Utente già registrato con questa email');
  }
  
  const newUser = {
    id: (demoUsers.length + 1).toString(),
    email,
    name,
    password,
  };
  
  demoUsers.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const logout = async (): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would invalidate the session on the server
  return;
};