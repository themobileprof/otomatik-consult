import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Clock, Calendar as CalendarIcon, Gift, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Booking = () => {
  const [selectedTab, setSelectedTab] = useState('free');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'free' | 'paid'>('free');

  // Available time slots for free sessions (30-minute slots)
  const freeTimeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  // Available time slots for paid sessions (hourly slots)
  const paidTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleBookingClick = (type: 'free' | 'paid') => {
    setBookingType(type);
    setSelectedDate(undefined);
    setSelectedTime('');
    setSelectedEndTime('');
    setIsDialogOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (bookingType === 'paid') {
      setSelectedEndTime(''); // Reset end time when start time changes
    }
  };

  const handleEndTimeSelect = (endTime: string) => {
    setSelectedEndTime(endTime);
  };

  const getAvailableEndTimes = () => {
    if (!selectedTime || bookingType === 'free') return [];
    
    const startIndex = paidTimeSlots.indexOf(selectedTime);
    if (startIndex === -1) return [];
    
    // Return all times after the selected start time
    return paidTimeSlots.slice(startIndex + 1);
  };

  const calculateDuration = () => {
    if (bookingType === 'free') return '30 minutes';
    if (!selectedTime || !selectedEndTime) return '';
    
    const startIndex = paidTimeSlots.indexOf(selectedTime);
    const endIndex = paidTimeSlots.indexOf(selectedEndTime);
    const hours = endIndex - startIndex;
    
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const calculateCost = () => {
    if (bookingType === 'free') return 'Free';
    if (!selectedTime || !selectedEndTime) return '';
    
    const startIndex = paidTimeSlots.indexOf(selectedTime);
    const endIndex = paidTimeSlots.indexOf(selectedEndTime);
    const hours = endIndex - startIndex;
    
    return `$${hours * 75}`;
  };

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime) {
      if (bookingType === 'free') {
        console.log(`Booking free 30-minute session for:`, format(selectedDate, 'PPP'), 'at', selectedTime);
      } else if (selectedEndTime) {
        console.log(`Booking paid session for:`, format(selectedDate, 'PPP'), 'from', selectedTime, 'to', selectedEndTime);
      }
      setIsDialogOpen(false);
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedEndTime('');
    }
  };

  const isBookingValid = () => {
    if (bookingType === 'free') {
      return selectedDate && selectedTime;
    }
    return selectedDate && selectedTime && selectedEndTime;
  };

  return (
    <section id="booking" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Book Your Session
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the consulting option that fits your needs
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 p-2 bg-slate-100 rounded-2xl">
              <TabsTrigger value="free" className="text-lg font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                Free Consultation
              </TabsTrigger>
              <TabsTrigger value="paid" className="text-lg font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                Paid Sessions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="free" className="space-y-6">
              <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 shadow-xl">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <Badge className="bg-emerald-500 text-white px-4 py-2 text-sm font-semibold">
                      <Gift className="w-4 h-4 mr-2" />
                      First-Time Only
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold text-slate-900">Free 30-Minute Consultation</CardTitle>
                  <CardDescription className="text-lg text-slate-600 mt-4">
                    Perfect for understanding your needs and exploring how we can help
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">30 minutes duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">Monday - Friday</span>
                    </div>
                  </div>
                  <div className="text-center pt-6">
                    <Dialog open={isDialogOpen && bookingType === 'free'} onOpenChange={(open) => {
                      if (bookingType === 'free') setIsDialogOpen(open);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => handleBookingClick('free')}
                        >
                          Book Free Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-center text-xl font-bold">
                            Schedule Your Free Consultation
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Select Date</h3>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateSelect}
                              disabled={(date) => {
                                const day = date.getDay();
                                return day === 0 || day === 6 || date < new Date();
                              }}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Select Time (30 min slots)</h3>
                            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                              {freeTimeSlots.map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleTimeSelect(time)}
                                  className="text-sm"
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        {isBookingValid() && (
                          <div className="text-center pt-4 border-t">
                            <p className="text-sm text-slate-600 mb-4">
                              You selected: {format(selectedDate!, 'PPP')} at {selectedTime} (30 minutes)
                            </p>
                            <Button 
                              onClick={handleConfirmBooking}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              Confirm Booking
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="paid" className="space-y-6">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <Badge className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Professional
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold text-slate-900">Expert Consulting Sessions</CardTitle>
                  <CardDescription className="text-lg text-slate-600 mt-4">
                    In-depth technical guidance with hands-on implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-blue-600 mb-2">$75</div>
                    <div className="text-xl text-slate-600">per hour</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-700">Select time range</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-700">Monday - Friday</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-blue-100">
                    <h4 className="font-semibold text-slate-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Flexible duration (1-8 hours)</li>
                      <li>• Direct access to senior engineers</li>
                      <li>• Follow-up documentation included</li>
                      <li>• Implementation guidance</li>
                    </ul>
                  </div>
                  <div className="text-center pt-6">
                    <Dialog open={isDialogOpen && bookingType === 'paid'} onOpenChange={(open) => {
                      if (bookingType === 'paid') setIsDialogOpen(open);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => handleBookingClick('paid')}
                        >
                          Schedule Paid Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-center text-xl font-bold">
                            Schedule Your Paid Session
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Select Date</h3>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateSelect}
                              disabled={(date) => {
                                const day = date.getDay();
                                return day === 0 || day === 6 || date < new Date();
                              }}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Start Time</h3>
                            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                              {paidTimeSlots.map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleTimeSelect(time)}
                                  className="text-sm"
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-3">End Time</h3>
                            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                              {selectedTime ? (
                                getAvailableEndTimes().map((time) => (
                                  <Button
                                    key={time}
                                    variant={selectedEndTime === time ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleEndTimeSelect(time)}
                                    className="text-sm"
                                  >
                                    {time}
                                  </Button>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500 text-center">Select start time first</p>
                              )}
                            </div>
                          </div>
                        </div>
                        {isBookingValid() && (
                          <div className="text-center pt-4 border-t">
                            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                              <p className="text-sm text-slate-600 mb-2">
                                <strong>Date:</strong> {format(selectedDate!, 'PPP')}
                              </p>
                              <p className="text-sm text-slate-600 mb-2">
                                <strong>Time:</strong> {selectedTime} - {selectedEndTime}
                              </p>
                              <p className="text-sm text-slate-600 mb-2">
                                <strong>Duration:</strong> {calculateDuration()}
                              </p>
                              <p className="text-lg font-semibold text-blue-600">
                                <strong>Total Cost:</strong> {calculateCost()}
                              </p>
                            </div>
                            <Button 
                              onClick={handleConfirmBooking}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Confirm Booking
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Booking;
