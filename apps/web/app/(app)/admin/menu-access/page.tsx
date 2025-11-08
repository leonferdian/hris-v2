'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from 'lucide-react';

export default function MenuAccessPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [access, setAccess] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchMenus();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserAccess();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const result = await response.json();
      setUsers(result.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/admin/menus');
      const result = await response.json();
      setMenus(result.data || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchUserAccess = async () => {
    try {
      const response = await fetch(`/api/admin/menu-access/${selectedUser}`);
      const result = await response.json();
      setAccess(result.access || {});
    } catch (error) {
      console.error('Error fetching access:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/menu-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser, access })
      });
      alert('Akses menu berhasil disimpan');
    } catch (error) {
      console.error('Error saving access:', error);
      alert('Gagal menyimpan akses menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Menu Access Control</h1>
          <p className="text-muted-foreground">Kelola hak akses menu user</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih User</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Pilih user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.username} - {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Akses Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menus.map((menu) => (
                <div key={menu.id} className="border-b pb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`menu-${menu.id}`}
                      checked={access[menu.id] || false}
                      onCheckedChange={(checked) =>
                        setAccess({ ...access, [menu.id]: checked as boolean })
                      }
                    />
                    <label
                      htmlFor={`menu-${menu.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {menu.name}
                    </label>
                  </div>
                  {menu.submenus && menu.submenus.length > 0 && (
                    <div className="ml-6 space-y-2">
                      {menu.submenus.map((submenu: any) => (
                        <div key={submenu.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`submenu-${submenu.id}`}
                            checked={access[`sub_${submenu.id}`] || false}
                            onCheckedChange={(checked) =>
                              setAccess({ ...access, [`sub_${submenu.id}`]: checked as boolean })
                            }
                          />
                          <label
                            htmlFor={`submenu-${submenu.id}`}
                            className="text-sm text-gray-600"
                          >
                            {submenu.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button className="mt-6" onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Access Rights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

