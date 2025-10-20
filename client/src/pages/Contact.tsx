import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FaPaperPlane, 
  FaClock, 
  FaCheckCircle,
  FaEnvelope,
  FaUser,
  FaCommentDots,
  FaHeadset,
  FaRocket,
  FaShieldAlt,
  FaTag,
  FaQuestionCircle,
  FaBug,
  FaLightbulb,
  FaBriefcase,
  FaDatabase,
  FaChartLine,
  FaPenNib
} from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const { toast } = useToast();

  useSEO({
    title: "Contact Us - Get Support | Word Counter Plus",
    description: "Contact Word Counter Plus for support, feature requests, partnerships, or questions about our word counter and text analysis tool. We respond within 24 hours.",
    keywords: "contact support, word counter plus contact, word counter help, customer service, feature requests, partnerships, technical support",
    canonical: "https://wordcounterplusapp.com/contact",
    ogImage: "/og-image.png",
    ogType: "website"
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to send message' }));
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "Your message has been securely stored. We'll respond within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setCustomSubject('');
      setShowCustomSubject(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate subject selection
    if (!formData.subject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject for your message.",
        variant: "destructive",
      });
      return;
    }

    // Validate custom subject if "Other" is selected
    if (formData.subject === "other" && !customSubject.trim()) {
      toast({
        title: "Custom Subject Required",
        description: "Please enter your custom subject.",
        variant: "destructive",
      });
      return;
    }
    
    // Use custom subject if "Other" is selected, otherwise use the label from options
    const finalFormData = {
      ...formData,
      subject: formData.subject === "other" 
        ? customSubject 
        : subjectOptions.find(opt => opt.value === formData.subject)?.label || formData.subject
    };
    
    contactMutation.mutate(finalFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const features = [
    {
      icon: <FaDatabase className="w-6 h-6" />,
      title: "Secure Storage",
      description: "All messages are securely stored in our database"
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Fast Response",
      description: "Get replies within 24 hours or less"
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Privacy Protected",
      description: "Your data is encrypted and never shared"
    }
  ];

  const subjectOptions = [
    { value: "technical-support", label: "Technical Support / Bug Report" },
    { value: "feature-request", label: "Feature Request / Suggestion" },
    { value: "business-inquiry", label: "Business Inquiry / Partnership" },
    { value: "export-issue", label: "Export / Download Issue" },
    { value: "feedback", label: "Feedback / Review" },
    { value: "general", label: "General Question" },
    { value: "other", label: "Other" }
  ];

  const contactReasons = [
    { 
      icon: <FaBug className="w-5 h-5 text-red-500" />, 
      title: "Technical Support",
      text: "Report bugs or get help with technical issues" 
    },
    { 
      icon: <FaLightbulb className="w-5 h-5 text-yellow-500" />, 
      title: "Feature Requests",
      text: "Suggest new features or improvements" 
    },
    { 
      icon: <FaBriefcase className="w-5 h-5 text-blue-500" />, 
      title: "Business Inquiries",
      text: "Discuss partnerships and collaborations" 
    },
    { 
      icon: <FaQuestionCircle className="w-5 h-5 text-purple-500" />, 
      title: "General Questions",
      text: "Ask anything about our services" 
    }
  ];

  const faqItems = [
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond within 24 hours during business days."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, all messages are encrypted and stored securely in our database."
    },
    {
      question: "Can I track my message?",
      answer: "You'll receive a confirmation once your message is sent successfully."
    }
  ];

  const stats = [
    { icon: <FaChartLine className="w-5 h-5" />, value: "99%", label: "Response Rate" },
    { icon: <FaClock className="w-5 h-5" />, value: "<24h", label: "Avg. Response Time" },
    { icon: <FaHeadset className="w-5 h-5" />, value: "24/7", label: "Support Available" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <FaEnvelope className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions or feedback? Send us a message and we'll get back to you as soon as possible. All messages are securely stored in our database.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-3 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Contact Form (Takes 2 columns) */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border shadow-xl">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <FaPaperPlane className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Send Us a Message</h2>
                      <p className="text-sm text-muted-foreground">Fill out the form below and we'll respond shortly</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4 text-primary" />
                            Full Name
                          </div>
                        </label>
                        <input 
                          type="text" 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base"
                          placeholder="John Doe"
                          data-testid="input-contact-name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-4 h-4 text-primary" />
                            Email Address
                          </div>
                        </label>
                        <input 
                          type="email" 
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base"
                          placeholder="john@example.com"
                          data-testid="input-contact-email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                        <div className="flex items-center gap-2">
                          <FaTag className="w-4 h-4 text-primary" />
                          Subject
                        </div>
                      </label>
                      <Select 
                        value={formData.subject} 
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, subject: value }));
                          setShowCustomSubject(value === "other");
                          if (value !== "other") setCustomSubject('');
                        }}
                      >
                        <SelectTrigger 
                          className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base h-auto"
                          data-testid="select-contact-subject"
                        >
                          <SelectValue placeholder="Select a subject...">
                            {formData.subject && subjectOptions.find(opt => opt.value === formData.subject)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="cursor-pointer">
                          {subjectOptions.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className="cursor-pointer hover:bg-primary/10 data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary transition-colors"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Custom Subject Input - Shows when "Other" is selected */}
                      {showCustomSubject && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <label htmlFor="customSubject" className="block text-sm font-semibold text-foreground mb-2">
                            <div className="flex items-center gap-2">
                              <FaTag className="w-4 h-4 text-primary" />
                              Enter Your Custom Subject
                            </div>
                          </label>
                          <input 
                            type="text" 
                            id="customSubject"
                            name="customSubject"
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base"
                            placeholder="Type your subject here..."
                            data-testid="input-custom-subject"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                        <div className="flex items-center gap-2">
                          <FaCommentDots className="w-4 h-4 text-primary" />
                          Your Message
                        </div>
                      </label>
                      <textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6} 
                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-vertical transition-all text-sm sm:text-base"
                        data-testid="textarea-contact-message"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      data-testid="button-send-message"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin flex items-center justify-center">
                            <FaPenNib className="text-primary-foreground text-xs" />
                          </div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FaDatabase className="text-primary mt-0.5 flex-shrink-0 w-5 h-5" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">Securely Stored in Database</p>
                        <p>Your message is encrypted and stored securely. We'll never share your information with third parties.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact Reasons & Info */}
            <div className="space-y-6">
              {/* Contact Reasons Card */}
              <Card className="bg-card border-border shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FaHeadset className="w-5 h-5 text-primary" />
                    How Can We Help?
                  </h3>
                  <div className="space-y-4">
                    {contactReasons.map((reason, index) => (
                      <div key={index} className="p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{reason.icon}</div>
                          <div>
                            <div className="font-semibold text-foreground text-sm">{reason.title}</div>
                            <div className="text-sm text-muted-foreground">{reason.text}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Card */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <FaClock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Quick Response Time</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        We typically respond within 24 hours during business days. Your message is automatically tracked in our system.
                      </p>
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                        <FaCheckCircle className="w-4 h-4" />
                        Guaranteed response
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <Card className="bg-card border-border shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <FaQuestionCircle className="w-7 h-7 text-primary" />
                  Frequently Asked Questions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {faqItems.map((item, index) => (
                    <div key={index} className="p-5 bg-gradient-to-br from-muted/50 to-background rounded-xl border border-border">
                      <h3 className="font-bold text-foreground mb-2 flex items-start gap-2">
                        <FaCheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>{item.question}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground ml-6">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 shadow-xl">
              <CardContent className="p-8 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Need Help with Our Tools?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-lg">
                  Visit our FAQ page for instant answers to common questions about Word Counter Plus features, file uploads, exports, and more.
                </p>
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  data-testid="link-faq"
                >
                  View FAQ
                  <FaRocket className="w-5 h-5" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
