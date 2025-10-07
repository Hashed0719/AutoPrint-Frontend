import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, loading, error } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (loading && !user) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error loading profile: {error.message}
      </div>
    );
  }

  if (!user) {
    return <div className="flex justify-center p-8">User not found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update your profile information' 
              : 'View and manage your profile information'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input 
                disabled 
                value={user.username} 
                placeholder="Username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+91 1234567890"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <Input 
                disabled 
                value={user.role || 'USER'} 
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            {isEditing ? (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form
                    setFormData({
                      fullName: user.fullName || '',
                      email: user.email || '',
                      phoneNumber: user.phoneNumber || '',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </>
            ) : (
              <Button 
                type="button" 
                onClick={() => setIsEditing(true)}
                className="ml-auto"
              >
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
