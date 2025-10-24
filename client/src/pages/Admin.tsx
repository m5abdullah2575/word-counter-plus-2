import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { FaLock, FaEnvelope, FaUser, FaClock } from 'react-icons/fa';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const res = await fetch('/api/contact-messages', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        throw new Error('Invalid password');
      }
      if (!res.ok) throw new Error('Failed to fetch');
      setIsAuthenticated(true);
      return res.json();
    },
    enabled: password.length > 0,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <FaLock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary mb-4"
              onKeyPress={(e) => e.key === 'Enter' && password && setIsAuthenticated(true)}
            />
            <button
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold"
            >
              Login
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">Invalid password</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Contact Messages</h1>
          <div className="text-sm text-muted-foreground">
            Total: {messages?.length || 0} messages
          </div>
        </div>

        {!messages || messages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FaEnvelope className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No messages yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <Card key={msg.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="font-semibold">{msg.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-semibold">
                          <a href={`mailto:${msg.email}`} className="hover:underline">
                            {msg.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Subject</div>
                    <div className="font-semibold text-lg">{msg.subject}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Message</div>
                    <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaClock />
                    {new Date(msg.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}