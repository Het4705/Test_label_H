
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Address } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAddresses, addAddress, deleteAddress } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number' }),
  addressLine1: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'City must be at least 2 characters' }),
  state: z.string().min(2, { message: 'State must be at least 2 characters' }),
  postalCode: z.string().min(5, { message: 'Please enter a valid postal code' }),
  country: z.string().min(2, { message: 'Country must be at least 2 characters' }),
  isDefault: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
}

const AddressDialog = ({ isOpen, onClose, onSelectAddress }: AddressDialogProps) => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false,
    },
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const userAddresses = await getUserAddresses(currentUser.uid);
          setAddresses(userAddresses);
          
          // Set default address if available
          const defaultAddress = userAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (userAddresses.length > 0) {
            setSelectedAddressId(userAddresses[0].id);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
          toast({
            title: 'Error',
            description: 'Could not fetch addresses',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen, currentUser, toast]);

  const handleAddAddress = async (data: FormData) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const newAddress = await addAddress(currentUser.uid, {
        ...data,
      });
      
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      setShowAddressForm(false);
      form.reset();
      
      toast({
        title: 'Address added',
        description: 'Your address has been saved',
      });
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: 'Error',
        description: 'Could not add the address',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    setIsLoading(true);
    try {
      await deleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      if (selectedAddressId === addressId) {
        setSelectedAddressId(addresses.length > 1 ? addresses[0].id : null);
      }
      
      toast({
        title: 'Address deleted',
        description: 'The address has been removed',
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'Could not delete the address',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      onClose();
    } else {
      toast({
        title: 'No address selected',
        description: 'Please select or add an address',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Delivery Address</DialogTitle>
          <DialogDescription>
            Choose an existing address or add a new one.
          </DialogDescription>
        </DialogHeader>

        {!showAddressForm ? (
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No addresses yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto ">
                {addresses.map((address) => (
                  <div 
                    key={address.id}
                    className={`border p-3 rounded-md cursor-pointer ${
                      selectedAddressId === address.id ? 'border-accent bg-accent/5' : 'border-border'
                    }`}
                    onClick={() => setSelectedAddressId(address.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{address.name} {address.isDefault && <span className="text-xs text-accent">(Default)</span>}</p>
                        <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                        {address.addressLine2 && <p className="text-sm text-muted-foreground">{address.addressLine2}</p>}
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                        <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4 gap-2 flex-wrap">
              <Button 
                variant="outline" 
                onClick={() => setShowAddressForm(true)}
                className='w-full'
              >
                Add New Address
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!selectedAddressId || isLoading}
                className='w-full'
              >
                Use Selected Address
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddAddress)} className="space-y-4 h-[80vh] overflow-scroll border-2 p-3 rounded-md">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="400001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Set as default address</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
