import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Users, 
  MessageSquare,
  Building,
  Globe,
  ExternalLink,
  Linkedin
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send email using a simple mailto link for now
      // In a production app, you'd use a proper email service
      const subject = `Contact Form Submission from ${formData.name}`;
      const body = `
Name: ${formData.name}
Email: ${formData.email}
Organization: ${formData.organization}

Message:
${formData.message}
      `;
      
      const mailtoLink = `mailto:rahuldassrm24@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        organization: '',
        message: ''
      });
      
      alert('Thank you for your message! Your email client should open with a pre-filled message to our team.');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'rahuldassrm24@gmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 9365394007',
      description: 'Mon-Fri 9AM-6PM IST'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'SRMIST Kattankulathur, Chengalpattu, 603203',
      description: 'Visit our research center'
    },
    {
      icon: Globe,
      title: 'Website',
      details: 'www.polyrisk.ai',
      description: 'Learn more about our work'
    }
  ];

  const teamMembers = [
    {
      name: 'Rahul Das',
      role: 'Team Leader',
      email: 'rahuldassrm24@gmail.com',
      expertise: 'AI/ML, Full Stack Development, Healthcare Technology',
      linkedin: 'https://www.linkedin.com/in/rahul-das-51b3452b9'
    },
    {
      name: 'Om Dwivedi',
      role: 'Team Co-Leader',
      email: 'om.dwivedi@polyrisk.ai',
      expertise: 'Data Science, Machine Learning, Research',
      linkedin: 'https://www.linkedin.com/in/om-dwivedi129/'
    },
    {
      name: 'Arnavraj Verma',
      role: 'Assistant',
      email: 'arnavraj.verma@polyrisk.ai',
      expertise: 'Backend Development, Database Management',
      linkedin: 'https://www.linkedin.com/in/arnavraj-verma-46275a2a2/'
    },
    {
      name: 'Pranjal Khali',
      role: 'Assistant',
      email: 'pranjal.khali@polyrisk.ai',
      expertise: 'Frontend Development, UI/UX Design',
      linkedin: 'https://www.linkedin.com/in/pranjal-khali-57b58927a/'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our research team to collaborate, ask questions, or learn more about our AI-powered healthcare solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.smith@hospital.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Massachusetts General Hospital"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your research interests, collaboration ideas, or questions..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>

                  <Button type="submit" variant="glow" className="w-full group">
                    <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Team */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Building className="h-5 w-5 mr-2" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-teal-100">
                        <Icon className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{info.title}</p>
                        <p className="text-gray-600 text-sm">{info.details}</p>
                        <p className="text-gray-500 text-xs">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Research Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Users className="h-5 w-5 mr-2" />
                  Research Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{member.name}</h4>
                        <p className="text-sm text-teal-600 font-medium">{member.role}</p>
                        <p className="text-xs text-gray-600 mt-1">{member.expertise}</p>
                        <a 
                          href={`mailto:${member.email}`}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          {member.email}
                        </a>
                      </div>
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Collaboration CTA */}
            <Card className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Collaborate with Us</h3>
                <p className="text-sm text-teal-100 mb-4">
                  Join our research community and help advance AI-powered healthcare
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white text-teal-600 hover:bg-teal-50 border-white"
                  onClick={() => window.open('https://github.com/RahulDas2003', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Research Team
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">How accurate is the AI model?</h3>
                <p className="text-gray-600 text-sm">
                  Our models achieve 95.5% accuracy in predicting drug interactions, validated through extensive clinical trials and real-world data.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Can I integrate this into my EHR system?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, we offer API integration and custom deployment options for seamless integration with existing healthcare systems.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Is the platform HIPAA compliant?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely. We maintain strict HIPAA compliance and follow all healthcare data security standards and regulations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">How can I contribute to the research?</h3>
                <p className="text-gray-600 text-sm">
                  We welcome collaborations from healthcare professionals, researchers, and institutions. Contact us to discuss partnership opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Contact;
