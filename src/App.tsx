/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Briefcase, 
  PenTool, 
  Wallet, 
  BookOpen, 
  User, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Cloud,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Plus,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  StickyNote,
  Hash,
  ChevronRight,
  FileText,
  Folder,
  ChevronDown,
  GripVertical,
  Clock,
  Tag,
  ListTodo,
  CalendarDays,
  ChevronLeft,
  Share2,
  Filter,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Music2,
  Target,
  Flag,
  Lightbulb,
  Trello,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Line,
  LineChart,
  ComposedChart
} from 'recharts';
import { cn } from './lib/utils';

// Mock Data
const analyticsData = [
  { name: 'Jan', youtube: 10200, facebook: 7800, linkedin: 11200, tiktok: 15600, instagram: 14200, email: 5100, total: 64100 },
  { name: 'Feb', youtube: 11800, facebook: 8000, linkedin: 13400, tiktok: 20300, instagram: 16900, email: 5400, total: 75800 },
  { name: 'Mar', youtube: 12400, facebook: 8200, linkedin: 15100, tiktok: 24800, instagram: 18300, email: 5600, total: 84400 },
];

const financeData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const INITIAL_TASKS = [
  { id: '1', title: 'Review Q1 Scaling Strategy', category: 'Strategy', status: 'In Progress', priority: 'High', labels: ['Strategy', 'Urgent'], checklist: [{ id: 1, text: 'Analyze Q1 data', completed: true }, { id: 2, text: 'Draft report', completed: false }] },
  { id: '2', title: 'Social Media Automation Audit', category: 'Tech', status: 'To Do', priority: 'Medium', labels: ['Tech'], checklist: [] },
  { id: '3', title: 'Client Education Webinar Prep', category: 'Education', status: 'Done', priority: 'High', labels: ['Education'], checklist: [] },
  { id: '4', title: 'Update Financial Forecast', category: 'Finance', status: 'To Do', priority: 'High', labels: ['Finance'], checklist: [] },
  { id: '5', title: 'Optimize LinkedIn Profile', category: 'Marketing', status: 'In Progress', priority: 'Medium', labels: ['Marketing'], checklist: [] },
];

const SEO_PAGES = [
  { id: 1, url: '/services/ai-consulting', title: 'AI Consulting Services', status: 'Needs Tweak', score: 65, issues: ['Missing Meta Description', 'Low Keyword Density'], lastChecked: '2026-03-24' },
  { id: 2, url: '/blog/future-of-automation', title: 'The Future of Automation', status: 'Good', score: 92, issues: [], lastChecked: '2026-03-25' },
  { id: 3, url: '/about-us', title: 'About Caseron', status: 'Critical', score: 42, issues: ['Duplicate Title Tag', 'No Alt Text on Images'], lastChecked: '2026-03-20' },
  { id: 4, url: '/contact', title: 'Contact Us', status: 'Good', score: 88, issues: ['Slow Load Time'], lastChecked: '2026-03-23' },
  { id: 5, url: '/case-studies/scaling-success', title: 'Case Study: Scaling Success', status: 'Needs Tweak', score: 71, issues: ['Internal Link Missing', 'H1 Tag Missing'], lastChecked: '2026-03-22' },
];

const kanbanColumns = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Done', title: 'Done' },
];

const scheduledContent = [
  { id: 1, title: 'AI in Accounting: The Future', platform: 'LinkedIn', date: '2026-03-26', time: '10:00 AM', status: 'Scheduled', type: 'Article' },
  { id: 2, title: 'Scaling Your Digital Agency', platform: 'Instagram', date: '2026-03-27', time: '02:00 PM', status: 'Draft', type: 'Reel' },
  { id: 3, title: 'Automation Hacks for Entrepreneurs', platform: 'Twitter', date: '2026-03-28', time: '09:00 AM', status: 'Scheduled', type: 'Thread' },
];

const platformFollowers = [
  { id: 'youtube', name: 'YouTube', count: '12.4K', lastWeekCount: '11.8K', lastMonthCount: '10.2K', lastYearCount: '4.5K', growth: '+5.2%', icon: Youtube, color: '#FF0000' },
  { id: 'facebook', name: 'Facebook', count: '8.2K', lastWeekCount: '8.0K', lastMonthCount: '7.8K', lastYearCount: '6.2K', growth: '+1.8%', icon: Facebook, color: '#1877F2' },
  { id: 'linkedin', name: 'LinkedIn', count: '15.1K', lastWeekCount: '13.4K', lastMonthCount: '11.2K', lastYearCount: '5.8K', growth: '+12.4%', icon: Linkedin, color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', count: '24.8K', lastWeekCount: '20.3K', lastMonthCount: '15.6K', lastYearCount: '2.1K', growth: '+22.1%', icon: Music2, color: '#000000' },
  { id: 'instagram', name: 'Instagram', count: '18.3K', lastWeekCount: '16.9K', lastMonthCount: '14.2K', lastYearCount: '8.4K', growth: '+8.4%', icon: Instagram, color: '#E4405F' },
  { id: 'email', name: 'Email List', count: '5.6K', lastWeekCount: '5.4K', lastMonthCount: '5.1K', lastYearCount: '3.2K', growth: '+3.2%', icon: Mail, color: '#00b0f0' },
];

const metricTargets = [
  { 
    id: 1, 
    name: 'Monthly Revenue', 
    current: 12450, 
    goal: 20000, 
    unit: '£', 
    deadline: 'June 2026',
    plan: [
      'Increase client acquisition by 20%',
      'Upsell automation packages to existing clients',
      'Launch "AI for Accountants" premium course'
    ]
  },
  { 
    id: 2, 
    name: 'Total Social Followers', 
    current: 94400, 
    goal: 150000, 
    unit: '', 
    deadline: 'Dec 2026',
    plan: [
      'Daily TikTok/Reels posting schedule',
      'Collaborate with 3 industry influencers',
      'Optimize YouTube SEO for scaling keywords'
    ]
  },
  { 
    id: 3, 
    name: 'Email Open Rate', 
    current: 24, 
    goal: 35, 
    unit: '%', 
    deadline: 'April 2026',
    plan: [
      'A/B test subject lines for every blast',
      'Segment list by industry niche',
      'Implement personalized "Casey" signatures'
    ]
  }
];

const performanceHistory = [
  { month: 'Jan', revenue: 8500, followers: 82000, engagement: 4.2 },
  { month: 'Feb', revenue: 10200, followers: 88500, engagement: 4.8 },
  { month: 'Mar', revenue: 12450, followers: 94400, engagement: 5.1 },
];

const competitorTrends = [
  { id: 1, topic: 'AI-Powered Tax Filing', growth: '+45%', platform: 'LinkedIn', sentiment: 'High' },
  { id: 2, topic: 'Short-form Video for B2B', growth: '+32%', platform: 'TikTok', sentiment: 'Medium' },
  { id: 3, topic: 'Automated Client Onboarding', growth: '+28%', platform: 'Twitter', sentiment: 'High' },
];

const calendarEvents = [
  { id: 1, time: '08:00', title: 'Morning Routine', category: 'Personal', duration: 1 },
  { id: 2, time: '09:00', title: 'Deep Work: Strategy', category: 'Focus', duration: 2 },
  { id: 3, time: '11:30', title: 'Client Call: Automation Audit', category: 'Meeting', duration: 1 },
  { id: 4, time: '13:00', title: 'Lunch Break', category: 'Personal', duration: 1 },
  { id: 5, time: '14:00', title: 'Team Sync', category: 'Meeting', duration: 1 },
  { id: 6, time: '15:30', title: 'Content Batching', category: 'Studio', duration: 2 },
  { id: 7, time: '18:00', title: 'Exercise', category: 'Personal', duration: 1 },
];

const mediaLibrary = [
  { id: 1, name: 'Brand Logo High Res', type: 'Image', size: '2.4 MB', date: 'Mar 20', thumbnail: 'https://picsum.photos/seed/logo/200/200' },
  { id: 2, name: 'Q1 Strategy Presentation', type: 'PDF', size: '15.8 MB', date: 'Mar 18', thumbnail: 'https://picsum.photos/seed/pdf/200/200' },
  { id: 3, name: 'Webinar Intro Video', type: 'Video', size: '145 MB', date: 'Mar 15', thumbnail: 'https://picsum.photos/seed/video/200/200' },
  { id: 4, name: 'Client Testimonial: TechCorp', type: 'Image', size: '1.2 MB', date: 'Mar 12', thumbnail: 'https://picsum.photos/seed/testimonial/200/200' },
  { id: 5, name: 'Automation Workflow Diagram', type: 'Image', size: '3.5 MB', date: 'Mar 10', thumbnail: 'https://picsum.photos/seed/diagram/200/200' },
];

const noteCategories = [
  {
    id: 'general',
    name: 'General',
    pages: [
      { id: 'welcome', title: 'Welcome to Command Centre', content: '# Welcome\nThis is your personal command centre. Use this space to organize your thoughts and scale your business.' },
      { id: 'quick-links', title: 'Quick Links', content: '### Important Resources\n- [Caseron Website](https://www.caseron.co.uk)\n- [Client Portal](https://portal.caseron.co.uk)' },
    ]
  },
  {
    id: 'projects',
    name: 'Projects',
    pages: [
      { id: 'scaling-2026', title: 'Scaling Strategy 2026', content: '## Objectives\n1. Increase automation efficiency by 40%\n2. Expand education sector client base' },
      { id: 'social-audit', title: 'Social Media Audit', content: '### Findings\n- Engagement is up on LinkedIn\n- Instagram needs more video content' },
    ]
  },
  {
    id: 'ideas',
    name: 'Ideas',
    pages: [
      { id: 'webinar-topics', title: 'Webinar Topics', content: '- AI for Accountants\n- Scaling Digital Agencies' },
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trelloConnected, setTrelloConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [wordpressConnected, setWordpressConnected] = useState(false);
  const [trelloBoards, setTrelloBoards] = useState<any[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [trelloTasks, setTrelloTasks] = useState<any[]>([]);
  const [isLoadingTrello, setIsLoadingTrello] = useState(false);
  
  // Real Metrics State
  const [trelloStats, setTrelloStats] = useState<{ totalCards: number; completedCards: number } | null>(null);
  const [youtubeStats, setYoutubeStats] = useState<any | null>(null);
  const [linkedinStats, setLinkedinStats] = useState<any | null>(null);
  const [facebookStats, setFacebookStats] = useState<any | null>(null);
  const [seoPages, setSeoPages] = useState<any[]>([]);
  const [gmailMessages, setGmailMessages] = useState<any[]>([]);
  const [gmailTodoMessages, setGmailTodoMessages] = useState<any[]>([]);
  const [isLoadingGmail, setIsLoadingGmail] = useState(false);
  const [tasks, setTasks] = useState<any[]>(INITIAL_TASKS);

  useEffect(() => {
    checkAuthStatus();
    
    const handleMessage = (event: MessageEvent) => {
      if (['TRELLO_AUTH_SUCCESS', 'GOOGLE_AUTH_SUCCESS', 'LINKEDIN_AUTH_SUCCESS', 'FACEBOOK_AUTH_SUCCESS'].includes(event.data?.type)) {
        checkAuthStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setTrelloConnected(data.trello);
      setGoogleConnected(data.google);
      setLinkedinConnected(data.linkedin);
      setFacebookConnected(data.facebook);
      setWordpressConnected(data.wordpress);
      
      if (data.trello) {
        fetchTrelloBoards();
        fetchTrelloStats();
      }
      if (data.google) {
        fetchYoutubeStats();
        fetchGmailMessages();
      }
      if (data.linkedin) {
        fetchLinkedinStats();
      }
      if (data.facebook) {
        fetchFacebookStats();
      }
      if (data.wordpress) {
        fetchSeoPages();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const fetchLinkedinStats = async () => {
    try {
      const response = await fetch('/api/linkedin/stats');
      const data = await response.json();
      setLinkedinStats(data);
    } catch (error) {
      console.error('Error fetching LinkedIn stats:', error);
    }
  };

  const fetchFacebookStats = async () => {
    try {
      const response = await fetch('/api/facebook/stats');
      const data = await response.json();
      setFacebookStats(data);
    } catch (error) {
      console.error('Error fetching Facebook stats:', error);
    }
  };

  const fetchSeoPages = async () => {
    try {
      const response = await fetch('/api/wordpress/seo-pages');
      const data = await response.json();
      if (Array.isArray(data)) {
        setSeoPages(data);
      }
    } catch (error) {
      console.error('Error fetching SEO pages:', error);
    }
  };

  const fetchGmailMessages = async () => {
    setIsLoadingGmail(true);
    try {
      const response = await fetch('/api/gmail/messages');
      const data = await response.json();
      setGmailMessages(data);
    } catch (error) {
      console.error('Error fetching Gmail messages:', error);
    } finally {
      setIsLoadingGmail(false);
    }
  };

  const fetchTrelloStats = async () => {
    try {
      const response = await fetch('/api/trello/stats');
      const data = await response.json();
      setTrelloStats(data);
    } catch (error) {
      console.error('Error fetching Trello stats:', error);
    }
  };

  const fetchYoutubeStats = async () => {
    try {
      const response = await fetch('/api/youtube/stats');
      const data = await response.json();
      setYoutubeStats(data);
    } catch (error) {
      console.error('Error fetching YouTube stats:', error);
    }
  };

  const handleLogoutTrello = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'trello' })
      });
      if (response.ok) {
        setTrelloConnected(false);
        setTrelloBoards([]);
        setTrelloTasks([]);
        setTrelloStats(null);
        setSelectedBoardId("");
      }
    } catch (error) {
      console.error('Error logging out from Trello:', error);
    }
  };

  const handleLogoutGoogle = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'google' })
      });
      if (response.ok) {
        setGoogleConnected(false);
        setYoutubeStats(null);
      }
    } catch (error) {
      console.error('Error logging out from Google:', error);
    }
  };

  const fetchTrelloBoards = async () => {
    try {
      const response = await fetch('/api/trello/boards');
      const data = await response.json();
      setTrelloBoards(data);
    } catch (error) {
      console.error('Error fetching Trello boards:', error);
    }
  };

  const fetchTrelloCards = async (boardId: string) => {
    setIsLoadingTrello(true);
    try {
      const response = await fetch(`/api/trello/cards?boardId=${boardId}`);
      const data = await response.json();
      setTrelloTasks(data);
    } catch (error) {
      console.error('Error fetching Trello cards:', error);
    } finally {
      setIsLoadingTrello(false);
    }
  };

  const handleConnectTrello = async () => {
    try {
      const response = await fetch('/api/auth/trello/url');
      const { url } = await response.json();
      window.open(url, 'trello_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Error connecting to Trello:', error);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Error connecting to Google:', error);
    }
  };

  const handleConnectLinkedin = async () => {
    try {
      const response = await fetch('/api/auth/linkedin/url');
      const { url } = await response.json();
      window.open(url, 'linkedin_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
    }
  };

  const handleConnectFacebook = async () => {
    try {
      const response = await fetch('/api/auth/facebook/url');
      const { url } = await response.json();
      window.open(url, 'facebook_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Error connecting to Facebook:', error);
    }
  };

  const handleConnectWordpress = async () => {
    // WordPress connection usually requires a URL and an Application Password
    // For now, we'll just show a prompt or a modal (to be implemented)
    const siteUrl = prompt('Enter your WordPress Site URL (e.g., https://example.com):');
    const appPassword = prompt('Enter your WordPress Application Password:');
    
    if (siteUrl && appPassword) {
      try {
        const response = await fetch('/api/auth/wordpress/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteUrl, appPassword })
        });
        if (response.ok) {
          setWordpressConnected(true);
          checkAuthStatus();
        }
      } catch (error) {
        console.error('Error connecting to WordPress:', error);
      }
    }
  };

  const handleLogout = async (service: 'trello' | 'google' | 'linkedin' | 'facebook' | 'wordpress') => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service })
      });
      if (service === 'trello') {
        setTrelloConnected(false);
        setTrelloBoards([]);
        setTrelloTasks([]);
        setTrelloStats(null);
      } else if (service === 'google') {
        setGoogleConnected(false);
        setYoutubeStats(null);
        setGmailMessages([]);
      } else if (service === 'linkedin') {
        setLinkedinConnected(false);
        setLinkedinStats(null);
      } else if (service === 'facebook') {
        setFacebookConnected(false);
        setFacebookStats(null);
      }
    } catch (error) {
      console.error(`Error logging out of ${service}:`, error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'briefing', label: 'Daily Briefing', icon: Briefcase },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'gmail', label: 'Inbox', icon: Mail },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare },
    { id: 'studio', label: 'Content Studio', icon: PenTool },
    { id: 'seo', label: 'SEO Tracking', icon: Search },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'finances', label: 'Finances Tracker', icon: Wallet },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'connections', label: 'Connections', icon: Share2 },
  ];

  const [selectedNoteId, setSelectedNoteId] = useState('welcome');
  const activeNote = noteCategories.flatMap(c => c.pages).find(p => p.id === selectedNoteId);

  return (
    <div className="flex min-h-screen bg-[#f8fbfe]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-brand-sky/20 flex flex-col sticky top-0 h-screen z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
            <Cloud className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-text">Caseron HQ</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "sidebar-item w-full",
                activeTab === item.id && "active"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-brand-sky/10 rounded-2xl p-4 border border-brand-sky/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-magenta/20 flex items-center justify-center">
                <TrendingUp className="text-brand-magenta w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-brand-slate">Scaling Progress</span>
            </div>
            <div className="w-full bg-white rounded-full h-2 mb-2">
              <div className="bg-brand-blue h-2 rounded-full w-[75%] shadow-sm" />
            </div>
            <span className="text-xs text-brand-slate font-medium">75% of monthly target met</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            {activeTab === 'dashboard' && (
              <>
                <h1 className="text-3xl font-bold text-brand-text mb-2">Welcome back, Casey</h1>
                <p className="text-brand-slate font-medium">Here's what's happening in your digital empire today.</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search command centre..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 w-64 transition-all"
              />
            </div>
            <button className="p-2.5 bg-white border border-brand-sky/20 rounded-xl text-brand-slate hover:bg-brand-sky/10 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-magenta rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center overflow-hidden">
              <img src="https://picsum.photos/seed/casey/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Daily Briefing Card */}
                <div className="cloud-card p-8 col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-brand-sky/5">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                      <Briefcase className="text-brand-blue" size={24} />
                      Daily Briefing
                    </h2>
                    <span className="text-sm font-semibold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
                      March 25, 2026
                    </span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg text-brand-text leading-relaxed">
                      "Casey, you have <span className="text-brand-blue font-bold">{trelloStats ? trelloStats.totalCards - trelloStats.completedCards : '3'} active</span> tasks today. 
                      {youtubeStats && (
                        <> Your YouTube channel <span className="text-brand-blue font-bold">{youtubeStats.title}</span> has reached <span className="text-brand-green font-bold">{Number(youtubeStats.subscriberCount).toLocaleString()}</span> subscribers!</>
                      )}
                      {!trelloStats && !youtubeStats && " Connect your accounts to see real-time business insights here."}
                    </p>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="p-4 bg-white rounded-2xl border border-brand-sky/10">
                        <span className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">Tasks</span>
                        <span className="text-xl font-bold text-brand-text">{trelloStats ? trelloStats.totalCards : '5'}</span>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-brand-sky/10">
                        <span className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">Completed</span>
                        <span className="text-xl font-bold text-brand-green">{trelloStats ? trelloStats.completedCards : '1'}</span>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-brand-sky/10">
                        <span className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">Pending</span>
                        <span className="text-xl font-bold text-brand-magenta">{trelloStats ? trelloStats.totalCards - trelloStats.completedCards : '4'}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-brand-sky/10 mt-4">
                      <h3 className="text-xs font-bold text-brand-slate uppercase tracking-widest mb-4">Metric Progress</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {metricTargets.map(target => {
                          let current = target.current;
                          if (target.name === 'Total Social Followers' && youtubeStats) {
                            current = Number(youtubeStats.subscriberCount);
                          }
                          return (
                            <div key={target.id} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-brand-text">{target.name}</span>
                                <span className="text-brand-blue">{Math.round((current / target.goal) * 100)}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-brand-blue h-full rounded-full" 
                                  style={{ width: `${Math.min(100, (current / target.goal) * 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="cloud-card p-8">
                  <h2 className="text-xl font-bold text-brand-text mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleConnectTrello}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group",
                        trelloConnected ? "bg-brand-blue/5 border-brand-blue text-brand-blue" : "border-brand-sky/20 hover:bg-brand-blue hover:text-white"
                      )}
                    >
                      <Trello className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-tight">{trelloConnected ? 'Trello Sync' : 'Link Trello'}</span>
                    </button>
                    <button 
                      onClick={handleConnectGoogle}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group",
                        googleConnected ? "bg-red-50 border-red-500 text-red-500" : "border-brand-sky/20 hover:bg-red-500 hover:text-white"
                      )}
                    >
                      <Youtube className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-tight">{googleConnected ? 'YouTube Sync' : 'Link YouTube'}</span>
                    </button>
                    <button 
                      onClick={handleConnectLinkedin}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group",
                        linkedinConnected ? "bg-blue-50 border-blue-600 text-blue-600" : "border-brand-sky/20 hover:bg-blue-600 hover:text-white"
                      )}
                    >
                      <Linkedin className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-tight">{linkedinConnected ? 'LinkedIn Sync' : 'Link LinkedIn'}</span>
                    </button>
                    <button 
                      onClick={handleConnectFacebook}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group",
                        facebookConnected ? "bg-blue-50 border-blue-800 text-blue-800" : "border-brand-sky/20 hover:bg-blue-800 hover:text-white"
                      )}
                    >
                      <Facebook className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-tight">{facebookConnected ? 'Facebook Sync' : 'Link Facebook'}</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-brand-sky/20 hover:bg-brand-green hover:text-white transition-all group">
                      <Calendar className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-tight">Schedule</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-brand-sky/20 hover:bg-brand-slate hover:text-white transition-all group">
                      <Settings className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-tight">Config</span>
                    </button>
                  </div>
                </div>

                {/* Audience Reach Grid */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {platformFollowers.map(platform => {
                    const isYouTube = platform.id === 'youtube';
                    const isLinkedIn = platform.id === 'linkedin';
                    const isFacebook = platform.id === 'facebook';
                    
                    const isConnected = (isYouTube && googleConnected) || (isLinkedIn && linkedinConnected) || (isFacebook && facebookConnected);
                    
                    let count = platform.count;
                    if (isYouTube && googleConnected && youtubeStats) {
                      count = `${(Number(youtubeStats.subscriberCount) / 1000).toFixed(1)}K`;
                    } else if (isLinkedIn && linkedinConnected && linkedinStats) {
                      count = `${(Number(linkedinStats.followerCount) / 1000).toFixed(1)}K`;
                    }
                    
                    const handleConnect = () => {
                      if (isYouTube) handleConnectGoogle();
                      if (isLinkedIn) handleConnectLinkedin();
                      if (isFacebook) handleConnectFacebook();
                    };
                    
                    return (
                      <div key={platform.id} className="cloud-card p-6 flex flex-col items-center text-center hover:scale-[1.02] transition-transform cursor-pointer group relative">
                        {!isConnected && (isYouTube || isLinkedIn || isFacebook) && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleConnect(); }}
                              className="bg-brand-blue text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg"
                            >
                              Connect Real Data
                            </button>
                          </div>
                        )}
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: `${platform.color}10`, color: platform.color }}>
                          <platform.icon size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-brand-slate uppercase tracking-widest mb-1">{platform.name}</span>
                        <div className="flex flex-col items-center w-full gap-4">
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-bold text-brand-slate uppercase tracking-tighter opacity-60">Current</span>
                            <span className="text-xl font-bold text-brand-text leading-none">{count}</span>
                          </div>
                          <div className="w-full border-t border-brand-sky/10 pt-4">
                            <div className="flex justify-center mb-3">
                              <span className="text-[10px] font-bold text-brand-green flex items-center gap-1">
                                <ArrowUpRight size={10} /> {platform.growth}
                              </span>
                            </div>
                            <div className="w-full overflow-hidden rounded-xl border border-brand-sky/5 bg-brand-sky/5">
                              <table className="w-full text-[9px] border-collapse">
                                <tbody>
                                  <tr className="border-b border-brand-sky/5">
                                    <td className="py-2 px-3 text-left font-bold text-brand-slate uppercase tracking-tighter opacity-60">Last Week</td>
                                    <td className="py-2 px-3 text-right font-bold text-brand-text text-sm">{platform.lastWeekCount}</td>
                                  </tr>
                                  <tr className="border-b border-brand-sky/5">
                                    <td className="py-2 px-3 text-left font-bold text-brand-slate uppercase tracking-tighter opacity-60">Last Month</td>
                                    <td className="py-2 px-3 text-right font-bold text-brand-text text-sm">{platform.lastMonthCount}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 px-3 text-left font-bold text-brand-slate uppercase tracking-tighter opacity-60">Last Year</td>
                                    <td className="py-2 px-3 text-right font-bold text-brand-text text-sm">{platform.lastYearCount}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Analytics Snapshot */}
                <div className="cloud-card p-8 col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-brand-text">Social Media Growth</h2>
                      <p className="text-sm text-brand-slate font-medium">Follower trends across all platforms</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-brand-blue" /> Total
                      </div>
                      {platformFollowers.map(p => (
                        <div key={p.id} className="flex items-center gap-2 text-[10px] font-bold text-brand-slate uppercase tracking-wider opacity-60">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} /> {p.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 12, fill: '#667a91'}} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fill: '#667a91'}}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                          formatter={(value: number) => [value.toLocaleString(), '']}
                        />
                        <Line type="monotone" dataKey="total" stroke="#00b0f0" strokeWidth={4} dot={{ r: 4, fill: '#00b0f0', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="linkedin" stroke="#0A66C2" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="tiktok" stroke="#000000" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="instagram" stroke="#E4405F" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="email" stroke="#00b0f0" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Task List Preview */}
                <div className="cloud-card p-8 col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-brand-text">Active Tasks</h2>
                    <button className="text-brand-blue text-sm font-bold hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border border-brand-sky/10 hover:border-brand-blue/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">{task.category}</span>
                          <MoreVertical size={14} className="text-brand-slate" />
                        </div>
                        <h3 className="font-bold text-brand-text mb-2 line-clamp-1">{task.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                            task.priority === 'High' ? "bg-brand-magenta/10 text-brand-magenta" : "bg-brand-slate/10 text-brand-slate"
                          )}>
                            {task.priority} Priority
                          </span>
                          <span className="text-[10px] font-bold text-brand-slate">{task.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Scaling & SEO Health */}
                <div className="cloud-card p-8 col-span-1 md:col-span-2 lg:col-span-1">
                  <h2 className="text-xl font-bold text-brand-text mb-2">Revenue Scaling</h2>
                  <p className="text-sm text-brand-slate font-medium mb-6">Monthly growth trajectory</p>
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-bold text-brand-text">£12,450</span>
                    <span className="text-brand-green font-bold text-sm flex items-center mb-1">
                      <ArrowUpRight size={16} /> +18.4%
                    </span>
                  </div>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financeData}>
                        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                          {financeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === financeData.length - 1 ? '#00b0f0' : '#9ad8f8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* SEO Health Snapshot */}
                <div className="cloud-card p-8 col-span-1 md:col-span-2 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-brand-text mb-1">SEO Health</h2>
                      <p className="text-sm text-brand-slate font-medium">WordPress content performance</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <Search size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-text">Overall Score</span>
                        <span className="text-2xl font-black text-brand-green">92/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-brand-green h-full rounded-full w-[92%] shadow-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
                          <span className="block text-[10px] font-bold text-brand-slate uppercase tracking-wider mb-1">Indexed Pages</span>
                          <span className="text-lg font-bold text-brand-text">142</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-brand-magenta/5 border border-brand-magenta/10">
                          <span className="block text-[10px] font-bold text-brand-slate uppercase tracking-wider mb-1">Crawl Errors</span>
                          <span className="text-lg font-bold text-brand-magenta">0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-brand-slate uppercase tracking-widest mb-2">Top Performing Pages</h3>
                      {seoPages.length > 0 ? (
                        seoPages.slice(0, 3).map((page, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-brand-sky/5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-brand-blue border border-brand-sky/10">
                                {idx + 1}
                              </div>
                              <span className="text-xs font-bold text-brand-text truncate">{page.title}</span>
                            </div>
                            <span className="text-xs font-bold text-brand-green">{page.seo_score}%</span>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-3">
                          {[
                            { title: 'Scaling for Accountants 2026', score: 98 },
                            { title: 'AI Automation Guide', score: 95 },
                            { title: 'Digital Agency Growth', score: 92 }
                          ].map((page, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-brand-sky/5">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-brand-blue border border-brand-sky/10">
                                  {idx + 1}
                                </div>
                                <span className="text-xs font-bold text-brand-text truncate">{page.title}</span>
                              </div>
                              <span className="text-xs font-bold text-brand-green">{page.score}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'connections' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-brand-text">Platform Connections</h1>
                    <p className="text-brand-slate font-medium">Manage your business integrations and data sync</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Trello */}
                  <div className="cloud-card p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#0079BF]/10 flex items-center justify-center text-[#0079BF]">
                        <Trello size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-text">Trello</h3>
                        <p className="text-xs text-brand-slate font-medium">Task & Project Management</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-slate">Status</span>
                        <span className={cn("font-bold", trelloConnected ? "text-brand-green" : "text-brand-magenta")}>
                          {trelloConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {trelloConnected ? (
                        <button 
                          onClick={() => handleLogout('trello')}
                          className="w-full py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm font-bold text-brand-magenta hover:bg-brand-magenta/5 transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button 
                          onClick={handleConnectTrello}
                          className="w-full py-2.5 bg-[#0079BF] text-white rounded-xl font-bold hover:bg-[#005c91] transition-all"
                        >
                          Connect Trello
                        </button>
                      )}
                    </div>
                  </div>

                  {/* YouTube / Google */}
                  <div className="cloud-card p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                        <Youtube size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-text">YouTube</h3>
                        <p className="text-xs text-brand-slate font-medium">Video Content & Audience</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-slate">Status</span>
                        <span className={cn("font-bold", googleConnected ? "text-brand-green" : "text-brand-magenta")}>
                          {googleConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {googleConnected ? (
                        <button 
                          onClick={() => handleLogout('google')}
                          className="w-full py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm font-bold text-brand-magenta hover:bg-brand-magenta/5 transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button 
                          onClick={handleConnectGoogle}
                          className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                        >
                          Connect YouTube
                        </button>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="cloud-card p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Linkedin size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-text">LinkedIn</h3>
                        <p className="text-xs text-brand-slate font-medium">Professional Networking</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-slate">Status</span>
                        <span className={cn("font-bold", linkedinConnected ? "text-brand-green" : "text-brand-magenta")}>
                          {linkedinConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {linkedinConnected ? (
                        <button 
                          onClick={() => handleLogout('linkedin')}
                          className="w-full py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm font-bold text-brand-magenta hover:bg-brand-magenta/5 transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button 
                          onClick={handleConnectLinkedin}
                          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                        >
                          Connect LinkedIn
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="cloud-card p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-800">
                        <Facebook size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-text">Facebook</h3>
                        <p className="text-xs text-brand-slate font-medium">Social Engagement</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-slate">Status</span>
                        <span className={cn("font-bold", facebookConnected ? "text-brand-green" : "text-brand-magenta")}>
                          {facebookConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {facebookConnected ? (
                        <button 
                          onClick={() => handleLogout('facebook')}
                          className="w-full py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm font-bold text-brand-magenta hover:bg-brand-magenta/5 transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button 
                          onClick={handleConnectFacebook}
                          className="w-full py-2.5 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all"
                        >
                          Connect Facebook
                        </button>
                      )}
                    </div>
                  </div>

                  {/* WordPress */}
                  <div className="cloud-card p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <LayoutDashboard size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-text">WordPress</h3>
                        <p className="text-xs text-brand-slate font-medium">Website & SEO Health</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-slate">Status</span>
                        <span className={cn("font-bold", wordpressConnected ? "text-brand-green" : "text-brand-magenta")}>
                          {wordpressConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {wordpressConnected ? (
                        <button 
                          onClick={() => handleLogout('wordpress')}
                          className="w-full py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm font-bold text-brand-magenta hover:bg-brand-magenta/5 transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button 
                          onClick={handleConnectWordpress}
                          className="w-full py-2.5 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue/90 transition-all"
                        >
                          Connect WordPress
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gmail' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-brand-text">Inbox Triage</h1>
                    <p className="text-brand-slate font-medium">Turn your unread emails into actionable tasks</p>
                  </div>
                  <button 
                    onClick={fetchGmailMessages}
                    disabled={isLoadingGmail || !googleConnected}
                    className="p-3 bg-white border border-brand-sky/20 rounded-2xl text-brand-blue hover:bg-brand-sky/5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={20} className={isLoadingGmail ? "animate-spin" : ""} />
                  </button>
                </div>

                {!googleConnected ? (
                  <div className="cloud-card p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto mb-6">
                      <Mail size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text mb-2">Google Account Not Linked</h2>
                    <p className="text-brand-slate mb-8 max-w-md mx-auto">Connect your Google account to access your Gmail inbox and start triaging your tasks.</p>
                    <button 
                      onClick={handleConnectGoogle}
                      className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                    >
                      Connect Google Account
                    </button>
                  </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        {gmailMessages.length === 0 && !isLoadingGmail ? (
                          <div className="cloud-card p-12 text-center">
                            <p className="text-brand-slate font-bold">No unread messages found.</p>
                          </div>
                        ) : (
                          gmailMessages.filter(msg => !gmailTodoMessages.some(todo => todo.id === msg.id)).map((msg) => (
                            <div key={msg.id} className="cloud-card p-6 hover:border-brand-blue/30 transition-all group">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="font-bold text-brand-text mb-1 line-clamp-1">{msg.subject}</h3>
                                  <p className="text-xs text-brand-slate font-bold mb-2">{msg.from}</p>
                                  <p className="text-sm text-brand-slate line-clamp-2">{msg.snippet}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className="text-[10px] font-bold text-brand-slate whitespace-nowrap">{new Date(msg.date).toLocaleDateString()}</span>
                                  <button 
                                    onClick={() => {
                                      const newTask = {
                                        id: Math.random().toString(36).substring(7),
                                        title: msg.subject,
                                        category: 'Email Triage',
                                        priority: 'Medium',
                                        status: 'To Do',
                                        description: `From: ${msg.from}\n\n${msg.snippet}`
                                      };
                                      setTasks([newTask, ...tasks]);
                                      setGmailTodoMessages([msg, ...gmailTodoMessages]);
                                    }}
                                    className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Mark as To Do"
                                  >
                                    <Plus size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div className="space-y-6">
                        {gmailTodoMessages.length > 0 && (
                          <div className="cloud-card p-6 border-l-4 border-brand-green">
                            <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2">
                              <CheckSquare size={18} className="text-brand-green" />
                              To Do Emails
                            </h3>
                            <div className="space-y-3">
                              {gmailTodoMessages.map((msg) => (
                                <div key={msg.id} className="p-3 bg-brand-green/5 rounded-xl border border-brand-green/10 group relative">
                                  <button 
                                    onClick={() => setGmailTodoMessages(gmailTodoMessages.filter(t => t.id !== msg.id))}
                                    className="absolute top-2 right-2 text-brand-slate hover:text-brand-magenta opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                  <h4 className="text-xs font-bold text-brand-text truncate pr-4">{msg.subject}</h4>
                                  <p className="text-[10px] text-brand-slate truncate">{msg.from}</p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-tighter">Action Required</span>
                                    <button 
                                      onClick={() => setActiveTab('tasks')}
                                      className="text-[9px] font-bold text-brand-blue hover:underline"
                                    >
                                      View Task
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      <div className="cloud-card p-6 bg-brand-blue text-white">
                        <h3 className="font-bold mb-2">Triage Logic</h3>
                        <p className="text-sm opacity-90 mb-4">Quickly convert emails into tasks. Once converted, they'll appear in your Task Management board.</p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-xs font-bold">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">1</div>
                            <span>Scan unread emails</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">2</div>
                            <span>Click + to create task</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">3</div>
                            <span>Prioritize in Task Board</span>
                          </div>
                        </div>
                      </div>

                      <div className="cloud-card p-6">
                        <h3 className="font-bold text-brand-text mb-4">Inbox Stats</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-brand-slate font-medium">Unread Messages</span>
                            <span className="text-sm font-bold text-brand-blue">{gmailMessages.length}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-blue h-full rounded-full" style={{ width: `${Math.min(100, (gmailMessages.length / 20) * 100)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-8">
                {/* Trello Integration Header */}
                <div className="cloud-card p-6 bg-gradient-to-r from-white to-brand-sky/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#0079BF]/10 flex items-center justify-center text-[#0079BF]">
                        <Trello size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-brand-text">Trello Integration</h2>
                        <p className="text-sm text-brand-slate font-medium">
                          {trelloConnected ? 'Connected to Trello' : 'Connect your Trello account to sync tasks'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {trelloConnected ? (
                        <>
                          <select 
                            value={selectedBoardId}
                            onChange={(e) => {
                              setSelectedBoardId(e.target.value);
                              if (e.target.value) fetchTrelloCards(e.target.value);
                            }}
                            className="px-4 py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 min-w-[200px]"
                          >
                            <option value="">Select a Board</option>
                            {trelloBoards.map(board => (
                              <option key={board.id} value={board.id}>{board.name}</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => selectedBoardId && fetchTrelloCards(selectedBoardId)}
                            disabled={!selectedBoardId || isLoadingTrello}
                            className="p-2.5 bg-brand-sky/10 text-brand-blue rounded-xl hover:bg-brand-sky/20 transition-colors disabled:opacity-50"
                            title="Refresh Tasks"
                          >
                            <RefreshCw size={20} className={isLoadingTrello ? "animate-spin" : ""} />
                          </button>
                          <button 
                            onClick={handleLogoutTrello}
                            className="px-4 py-2.5 bg-white border border-brand-sky/20 rounded-xl text-sm font-bold text-brand-magenta hover:bg-brand-magenta/5 transition-colors"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={handleConnectTrello}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#0079BF] text-white rounded-xl font-bold hover:bg-[#005c91] transition-all shadow-lg shadow-[#0079BF]/20"
                        >
                          <Trello size={18} />
                          Connect Trello
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4">
                  {/* Combine local tasks and Trello tasks for visualization */}
                  {kanbanColumns.map(column => {
                    const columnTasks = [
                      ...tasks.filter(t => t.status === column.id),
                      ...trelloTasks.filter(t => t.status === column.id)
                    ];
                    
                    return (
                      <div key={column.id} className="flex-shrink-0 w-80">
                        <div className="flex items-center justify-between mb-4 px-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-brand-text">{column.title}</h3>
                            <span className="bg-brand-sky/20 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {columnTasks.length}
                            </span>
                          </div>
                          <button className="p-1 hover:bg-brand-sky/20 rounded-md text-brand-slate">
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="space-y-4">
                          {columnTasks.map(task => (
                            <div key={task.id} className="cloud-card p-4 hover:border-brand-blue/30 cursor-grab active:cursor-grabbing relative group">
                              {task.id.toString().length > 10 && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trello size={12} className="text-[#0079BF]" />
                                </div>
                              )}
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-wrap gap-1">
                                  {task.labels?.map((label: string) => (
                                    <span key={label} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue uppercase">
                                      {label}
                                    </span>
                                  ))}
                                </div>
                                <button className="text-brand-slate hover:text-brand-text">
                                  <MoreVertical size={14} />
                                </button>
                              </div>
                              <h4 className="font-bold text-brand-text mb-3 leading-tight">{task.title}</h4>
                              
                              {task.checklist && task.checklist.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-brand-slate flex items-center gap-1">
                                      <ListTodo size={12} /> 
                                      {task.checklist.filter((c: any) => c.completed).length}/{task.checklist.length}
                                    </span>
                                    <span className="text-[10px] font-bold text-brand-blue">
                                      {Math.round((task.checklist.filter((c: any) => c.completed).length / task.checklist.length) * 100)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-1 rounded-full">
                                    <div 
                                      className="bg-brand-blue h-1 rounded-full transition-all" 
                                      style={{ width: `${(task.checklist.filter((c: any) => c.completed).length / task.checklist.length) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {task.due && (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-magenta mb-3">
                                  <Clock size={12} />
                                  {new Date(task.due).toLocaleDateString()}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                  <img src={`https://picsum.photos/seed/${task.id}/32/32`} className="w-6 h-6 rounded-full border-2 border-white" alt="User" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex items-center gap-2 text-brand-slate">
                                  <MessageSquare size={12} />
                                  <span className="text-[10px] font-bold">2</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex-shrink-0 w-80">
                    <button className="w-full p-4 rounded-3xl border-2 border-dashed border-brand-sky/30 text-brand-slate font-bold flex items-center justify-center gap-2 hover:bg-brand-sky/5 hover:border-brand-sky/50 transition-all">
                      <Plus size={20} /> Add Column
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'studio' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div className="cloud-card p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-brand-text">March 2026</h2>
                        <div className="flex gap-1">
                          <button className="p-2 hover:bg-slate-50 rounded-xl border border-brand-sky/10"><ChevronLeft size={18} /></button>
                          <button className="p-2 hover:bg-slate-50 rounded-xl border border-brand-sky/10"><ChevronRight size={18} /></button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-50 text-brand-text text-sm font-bold rounded-xl border border-brand-sky/10">Month</button>
                        <button className="px-4 py-2 bg-brand-blue text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-blue/20">Week</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="bg-slate-50 p-3 text-center text-[10px] font-bold text-brand-slate uppercase tracking-widest">{day}</div>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => {
                        const day = i - 3; // Mocking start of month
                        const isToday = day === 25;
                        const hasContent = scheduledContent.find(c => parseInt(c.date.split('-')[2]) === day);
                        
                        return (
                          <div key={i} className={cn(
                            "bg-white min-h-[100px] p-2 relative group transition-colors hover:bg-slate-50/50",
                            day <= 0 && "bg-slate-50/30"
                          )}>
                            <span className={cn(
                              "text-xs font-bold",
                              isToday ? "bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center" : "text-brand-slate"
                            )}>
                              {day > 0 && day <= 31 ? day : ''}
                            </span>
                            {hasContent && (
                              <div className="mt-2 p-1.5 rounded-lg bg-brand-blue/10 border-l-4 border-brand-blue">
                                <span className="block text-[9px] font-bold text-brand-blue truncate">{hasContent.platform}</span>
                                <span className="block text-[10px] font-bold text-brand-text truncate">{hasContent.title}</span>
                              </div>
                            )}
                            {day > 0 && day <= 31 && (
                              <button className="absolute bottom-2 right-2 p-1 bg-brand-blue text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus size={12} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="cloud-card p-6">
                    <h3 className="font-bold text-brand-text mb-4">Upcoming Content</h3>
                    <div className="space-y-4">
                      {scheduledContent.map(content => (
                        <div key={content.id} className="p-4 rounded-2xl border border-brand-sky/10 hover:border-brand-blue/30 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-brand-blue uppercase">{content.platform}</span>
                            <span className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded-full",
                              content.status === 'Scheduled' ? "bg-brand-green/10 text-brand-green" : "bg-brand-magenta/10 text-brand-magenta"
                            )}>{content.status}</span>
                          </div>
                          <h4 className="text-sm font-bold text-brand-text mb-2">{content.title}</h4>
                          <div className="flex items-center gap-3 text-brand-slate">
                            <div className="flex items-center gap-1 text-[10px] font-bold">
                              <CalendarDays size={12} /> {content.date}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold">
                              <Clock size={12} /> {content.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-brand-blue text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                      <Plus size={18} /> Schedule New
                    </button>
                  </div>

                  <div className="cloud-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-brand-text">Media Library</h3>
                      <button className="text-brand-blue text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {mediaLibrary.slice(0, 4).map(item => (
                        <div key={item.id} className="group cursor-pointer">
                          <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 border border-brand-sky/10">
                            <img 
                              src={item.thumbnail} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button className="p-2 bg-white rounded-full text-brand-blue shadow-lg">
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[8px] font-bold text-brand-text uppercase">
                              {item.type}
                            </div>
                          </div>
                          <h4 className="text-[10px] font-bold text-brand-text truncate px-1">{item.name}</h4>
                          <span className="text-[8px] font-bold text-brand-slate px-1">{item.size}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-3 border-2 border-dashed border-brand-sky/30 text-brand-slate font-bold rounded-2xl hover:bg-brand-sky/5 hover:border-brand-sky/50 transition-all flex items-center justify-center gap-2">
                      <Folder size={18} /> Upload Media
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'briefing' && (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-brand-text">Daily Briefing</h2>
                  <div className="flex items-center gap-2 text-brand-slate font-bold">
                    <Calendar size={20} />
                    March 25, 2026
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="cloud-card p-8 col-span-1 md:col-span-2 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
                        <MessageSquare className="text-brand-blue" size={24} />
                        AI Summary
                      </h3>
                      <div className="p-6 bg-brand-blue/5 rounded-3xl border border-brand-blue/10">
                        <p className="text-lg text-brand-text leading-relaxed italic">
                          "Good morning, Casey. Today is a pivotal day for your scaling strategy. You have three high-priority tasks that require deep focus. Your social media engagement is trending upwards, particularly on LinkedIn, which is a prime opportunity to push your new automation packages. Financially, you're on track to hit your Q1 targets if current growth sustains."
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
                        <Target className="text-brand-magenta" size={24} />
                        Metric Performance
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {metricTargets.map(target => (
                          <div key={target.id} className="p-6 rounded-2xl border border-brand-sky/10 bg-white hover:border-brand-blue/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-xs font-bold text-brand-slate uppercase tracking-widest">{target.name}</span>
                              <span className="text-xs font-bold text-brand-blue">{Math.round((target.current / target.goal) * 100)}%</span>
                            </div>
                            <div className="flex items-end gap-2 mb-4">
                              <span className="text-2xl font-bold text-brand-text">{target.unit}{target.current.toLocaleString()}</span>
                              <span className="text-xs text-brand-slate font-medium mb-1">/ {target.unit}{target.goal.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-brand-blue h-full rounded-full" 
                                style={{ width: `${(target.current / target.goal) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="cloud-card p-8">
                      <h3 className="text-lg font-bold text-brand-text mb-6">Today's Schedule</h3>
                      <div className="space-y-6">
                        {[
                          { time: '09:00 AM', title: 'Deep Work: Strategy', type: 'Focus' },
                          { time: '11:30 AM', title: 'Team Sync', type: 'Meeting' },
                          { time: '02:00 PM', title: 'Scaling Review', type: 'Critical' },
                          { time: '04:30 PM', title: 'Content Batching', type: 'Studio' },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <span className="text-[10px] font-bold text-brand-blue w-14 pt-1">{item.time}</span>
                            <div>
                              <h4 className="text-sm font-bold text-brand-text">{item.title}</h4>
                              <span className="text-[10px] font-bold text-brand-slate uppercase tracking-tighter">{item.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="cloud-card p-8 bg-brand-magenta text-white">
                      <h3 className="text-lg font-bold mb-4">Urgent Alert</h3>
                      <p className="text-sm opacity-90 mb-6 font-medium">Your LinkedIn automation encountered an error on 2 posts. Manual review required.</p>
                      <button className="w-full py-3 bg-white text-brand-magenta font-bold rounded-2xl hover:scale-105 transition-transform">
                        Resolve Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'targets' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-brand-text">Metric Goals</h2>
                  {metricTargets.map(target => (
                    <div key={target.id} className="cloud-card p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                            <Flag size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-text">{target.name}</h3>
                            <span className="text-xs text-brand-slate font-medium">Deadline: {target.deadline}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-lg font-bold text-brand-text">
                            {target.unit}{target.current.toLocaleString()} / {target.unit}{target.goal.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-brand-blue">
                            {Math.round((target.current / target.goal) * 100)}% Complete
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-8">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(target.current / target.goal) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-brand-blue h-full rounded-full shadow-sm"
                        />
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-6 border border-brand-sky/10">
                        <h4 className="text-sm font-bold text-brand-text mb-4 flex items-center gap-2">
                          <Lightbulb size={16} className="text-brand-magenta" />
                          Action Plan
                        </h4>
                        <ul className="space-y-3">
                          {target.plan.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-brand-slate font-medium">
                              <div className="w-5 h-5 rounded-full bg-white border border-brand-sky/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-brand-blue">
                                {i + 1}
                              </div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-brand-text">Strategic Roadmap</h2>
                  <div className="cloud-card p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-brand-magenta/10 flex items-center justify-center text-brand-magenta">
                          <TrendingUp size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-brand-text">2026 Vision</h3>
                          <p className="text-sm text-brand-slate font-medium">The path to 7-figure automation</p>
                        </div>
                      </div>
                      
                      <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-sky/20">
                        {[
                          { phase: 'Phase 1', title: 'Foundation & Automation', status: 'Completed', color: 'brand-green' },
                          { phase: 'Phase 2', title: 'Audience Expansion', status: 'In Progress', color: 'brand-blue' },
                          { phase: 'Phase 3', title: 'Product Launch', status: 'Upcoming', color: 'brand-slate' },
                          { phase: 'Phase 4', title: 'Scale & Exit Strategy', status: 'Upcoming', color: 'brand-slate' },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-6 relative">
                            <div className={cn(
                              "w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10",
                              item.status === 'Completed' ? "bg-brand-green text-white" : 
                              item.status === 'In Progress' ? "bg-brand-blue text-white" : "bg-slate-200 text-slate-400"
                            )}>
                              {i + 1}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">{item.phase}</span>
                              <h4 className="font-bold text-brand-text text-lg">{item.title}</h4>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                                item.status === 'Completed' ? "bg-brand-green/10 text-brand-green" : 
                                item.status === 'In Progress' ? "bg-brand-blue/10 text-brand-blue" : "bg-slate-100 text-slate-400"
                              )}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance History & Competitor Trends */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="cloud-card p-8 lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-brand-text">3-Month Performance</h2>
                        <p className="text-sm text-brand-slate font-medium">Growth across core metrics</p>
                      </div>
                      <div className="bg-brand-green/10 text-brand-green px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                        <TrendingUp size={16} />
                        Best Performer: Revenue (+46%)
                      </div>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={performanceHistory}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#667a91'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#667a91'}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                          />
                          <Bar dataKey="revenue" fill="#00b0f0" radius={[4, 4, 0, 0]} name="Revenue (£)" />
                          <Bar dataKey="engagement" fill="#ff33cc" radius={[4, 4, 0, 0]} name="Engagement (%)" />
                          <Line type="monotone" dataKey="revenue" stroke="#00b0f0" strokeWidth={2} dot={{ r: 4, fill: '#00b0f0' }} name="Revenue Trend" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="cloud-card p-8">
                    <h2 className="text-xl font-bold text-brand-text mb-6">Competitor Trends</h2>
                    <div className="space-y-6">
                      {competitorTrends.map(trend => (
                        <div key={trend.id} className="p-4 rounded-2xl bg-slate-50 border border-brand-sky/10 hover:border-brand-magenta/30 transition-all cursor-pointer group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-brand-magenta uppercase tracking-widest">{trend.platform}</span>
                            <span className="text-brand-green font-bold text-xs flex items-center gap-1">
                              <ArrowUpRight size={14} /> {trend.growth}
                            </span>
                          </div>
                          <h4 className="font-bold text-brand-text mb-2 group-hover:text-brand-magenta transition-colors">{trend.topic}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-brand-slate">Sentiment:</span>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full",
                              trend.sentiment === 'High' ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                            )}>{trend.sentiment}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-brand-magenta text-white font-bold rounded-2xl shadow-lg shadow-brand-magenta/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                      <Search size={18} /> Deep Competitor Audit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finances' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="cloud-card p-8 bg-gradient-to-br from-brand-blue to-brand-blue/80 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-bold uppercase tracking-wider opacity-80">Total Revenue</span>
                      <Wallet size={24} className="opacity-80" />
                    </div>
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-4xl font-bold">£48,250</span>
                      <span className="text-brand-green font-bold text-sm bg-white/20 px-2 py-0.5 rounded-lg flex items-center mb-1">
                        <ArrowUpRight size={16} /> +12%
                      </span>
                    </div>
                    <p className="text-sm opacity-70">Compared to last month</p>
                  </div>
                  <div className="cloud-card p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-bold text-brand-slate uppercase tracking-wider">Net Profit</span>
                      <TrendingUp size={24} className="text-brand-green" />
                    </div>
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-4xl font-bold text-brand-text">£32,100</span>
                      <span className="text-brand-green font-bold text-sm flex items-center mb-1">
                        <ArrowUpRight size={16} /> +8%
                      </span>
                    </div>
                    <p className="text-sm text-brand-slate">Margin: 66.5%</p>
                  </div>
                  <div className="cloud-card p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-bold text-brand-slate uppercase tracking-wider">Expenses</span>
                      <ArrowDownRight size={24} className="text-brand-magenta" />
                    </div>
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-4xl font-bold text-brand-text">£16,150</span>
                      <span className="text-brand-magenta font-bold text-sm flex items-center mb-1">
                        <ArrowUpRight size={16} /> +4%
                      </span>
                    </div>
                    <p className="text-sm text-brand-slate">Operational costs</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="cloud-card p-8 lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-bold text-brand-text">Revenue Growth</h2>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-50 rounded-xl border border-brand-sky/10"><Share2 size={18} className="text-brand-slate" /></button>
                        <button className="p-2 hover:bg-slate-50 rounded-xl border border-brand-sky/10"><Filter size={18} className="text-brand-slate" /></button>
                      </div>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financeData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00b0f0" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00b0f0" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#667a91'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#667a91'}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#00b0f0" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="cloud-card p-8">
                    <h2 className="text-xl font-bold text-brand-text mb-6">Recent Transactions</h2>
                    <div className="space-y-6">
                      {[
                        { id: 1, name: 'Google Workspace', date: 'Mar 24', amount: '-£120', type: 'Expense' },
                        { id: 2, name: 'Client Payment: TechCorp', date: 'Mar 23', amount: '+£4,500', type: 'Income' },
                        { id: 3, name: 'LinkedIn Ads', date: 'Mar 22', amount: '-£850', type: 'Expense' },
                        { id: 4, name: 'Client Payment: EduScale', date: 'Mar 21', amount: '+£3,200', type: 'Income' },
                      ].map(tx => (
                        <div key={tx.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              tx.type === 'Income' ? "bg-brand-green/10 text-brand-green" : "bg-brand-magenta/10 text-brand-magenta"
                            )}>
                              {tx.type === 'Income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                            </div>
                            <div>
                              <span className="block font-bold text-brand-text text-sm">{tx.name}</span>
                              <span className="text-xs text-brand-slate font-medium">{tx.date}</span>
                            </div>
                          </div>
                          <span className={cn(
                            "font-bold",
                            tx.type === 'Income' ? "text-brand-green" : "text-brand-text"
                          )}>{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 py-3 border-2 border-brand-sky/20 text-brand-blue font-bold rounded-2xl hover:bg-brand-sky/5 transition-all">
                      View Statement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div className="cloud-card p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-brand-text">Daily Planner</h2>
                        <p className="text-sm text-brand-slate font-medium">Block out your day for maximum efficiency</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          <button className="p-2 hover:bg-slate-50 rounded-xl border border-brand-sky/10"><ChevronLeft size={18} /></button>
                          <button className="p-2 hover:bg-slate-50 rounded-xl border border-brand-sky/10"><ChevronRight size={18} /></button>
                        </div>
                        <span className="text-lg font-bold text-brand-text">March 25, 2026</span>
                      </div>
                    </div>

                    <div className="relative border-t border-slate-100 mt-4">
                      {/* Time markers */}
                      {Array.from({ length: 13 }).map((_, i) => {
                        const hour = i + 7;
                        return (
                          <div key={hour} className="flex h-20 border-b border-slate-50 relative group">
                            <span className="w-16 text-[10px] font-bold text-brand-slate pt-2 pr-4 text-right">
                              {hour < 10 ? `0${hour}` : hour}:00
                            </span>
                            <div className="flex-1 relative">
                              {/* Grid lines */}
                              <div className="absolute top-1/2 left-0 right-0 border-t border-slate-50 border-dashed" />
                              
                              {/* Hover to add */}
                              <button className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-blue/5 flex items-center justify-center transition-opacity">
                                <Plus size={16} className="text-brand-blue" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Events */}
                      {calendarEvents.map(event => {
                        const startHour = parseInt(event.time.split(':')[0]);
                        const startMinute = parseInt(event.time.split(':')[1]);
                        const topOffset = (startHour - 7) * 80 + (startMinute / 60) * 80;
                        const height = event.duration * 80;

                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                              "absolute left-16 right-4 rounded-2xl p-4 border-l-4 shadow-sm cursor-pointer hover:scale-[1.01] transition-transform",
                              event.category === 'Focus' ? "bg-brand-blue/10 border-brand-blue text-brand-blue" :
                              event.category === 'Meeting' ? "bg-brand-magenta/10 border-brand-magenta text-brand-magenta" :
                              event.category === 'Studio' ? "bg-brand-green/10 border-brand-green text-brand-green" :
                              "bg-slate-100 border-slate-300 text-brand-slate"
                            )}
                            style={{ top: `${topOffset}px`, height: `${height - 4}px`, zIndex: 10 }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">{event.category}</span>
                                <h4 className="font-bold text-sm leading-tight">{event.title}</h4>
                              </div>
                              <span className="text-[10px] font-bold opacity-70">{event.time}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="cloud-card p-6">
                    <h3 className="font-bold text-brand-text mb-4">Time Blocking Stats</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Deep Work', hours: 4, color: 'brand-blue' },
                        { label: 'Meetings', hours: 2, color: 'brand-magenta' },
                        { label: 'Studio Time', hours: 2, color: 'brand-green' },
                        { label: 'Personal', hours: 3, color: 'brand-slate' },
                      ].map(stat => (
                        <div key={stat.label} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-brand-slate">{stat.label}</span>
                            <span className="text-brand-text">{stat.hours}h</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", `bg-${stat.color}`)} style={{ width: `${(stat.hours / 12) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cloud-card p-6 bg-brand-blue text-white">
                    <h3 className="font-bold mb-2">Productivity Tip</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      "Casey, your peak focus time is between 9 AM and 11 AM. You've blocked this for Strategy today—excellent choice."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-brand-text">SEO Health Tracker</h1>
                    <p className="text-brand-slate font-medium">Monitor and optimize your WordPress page rankings</p>
                  </div>
                  <div className="flex gap-3">
                    {!wordpressConnected && (
                      <button 
                        onClick={handleConnectWordpress}
                        className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-brand-blue/90 transition-all flex items-center gap-2"
                      >
                        <LayoutDashboard size={16} /> Connect WordPress
                      </button>
                    )}
                    <button className="px-4 py-2 bg-white border border-brand-sky/20 rounded-xl text-sm font-bold text-brand-text hover:bg-brand-sky/5 transition-all flex items-center gap-2">
                      <RefreshCw size={16} /> Rescan Site
                    </button>
                    <button className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-brand-blue/90 transition-all flex items-center gap-2">
                      <Plus size={16} /> Add Page
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="cloud-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-brand-slate font-bold uppercase tracking-wider">Healthy Pages</p>
                      <h3 className="text-2xl font-bold text-brand-text">12</h3>
                    </div>
                  </div>
                  <div className="cloud-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-brand-slate font-bold uppercase tracking-wider">Needs Tweak</p>
                      <h3 className="text-2xl font-bold text-brand-text">5</h3>
                    </div>
                  </div>
                  <div className="cloud-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-magenta/10 flex items-center justify-center text-brand-magenta">
                      <XCircle size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-brand-slate font-bold uppercase tracking-wider">Critical Issues</p>
                      <h3 className="text-2xl font-bold text-brand-text">2</h3>
                    </div>
                  </div>
                </div>

                <div className="cloud-card overflow-hidden">
                  <div className="p-6 border-b border-brand-sky/10 bg-brand-sky/5">
                    <h3 className="font-bold text-brand-text">WordPress Page SEO Status</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs font-bold text-brand-slate uppercase tracking-wider border-b border-brand-sky/10">
                          <th className="px-6 py-4">Page Title & URL</th>
                          <th className="px-6 py-4">SEO Score</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Top Issues</th>
                          <th className="px-6 py-4">Last Checked</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-sky/10">
                        {(seoPages.length > 0 ? seoPages : SEO_PAGES).map((page) => (
                          <tr key={page.id} className="hover:bg-brand-sky/5 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-bold text-brand-text">{page.title}</div>
                              <div className="text-xs text-brand-slate font-medium">{page.url}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full",
                                      page.score > 80 ? "bg-brand-green" : page.score > 60 ? "bg-brand-orange" : "bg-brand-magenta"
                                    )}
                                    style={{ width: `${page.score}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-brand-text">{page.score}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                page.status === 'Good' ? "bg-brand-green/10 text-brand-green" : 
                                page.status === 'Needs Tweak' ? "bg-brand-orange/10 text-brand-orange" : 
                                "bg-brand-magenta/10 text-brand-magenta"
                              )}>
                                {page.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {page.issues.length > 0 ? (
                                  page.issues.map((issue, i) => (
                                    <span key={i} className="text-[10px] bg-slate-100 text-brand-slate px-2 py-0.5 rounded-md font-medium">
                                      {issue}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-brand-green font-bold">Optimized</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-brand-slate font-medium">
                              {page.lastChecked}
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => {
                                  const newTask = {
                                    id: Math.random().toString(36).substring(7),
                                    title: `Fix SEO for ${page.title}`,
                                    category: 'SEO',
                                    priority: page.status === 'Critical' ? 'High' : 'Medium',
                                    status: 'To Do',
                                    description: `Issues to fix:\n${page.issues.join('\n')}\n\nURL: ${page.url}`
                                  };
                                  setTasks([newTask, ...tasks]);
                                  setActiveTab('tasks');
                                }}
                                className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Create Task"
                              >
                                <Plus size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="cloud-card p-6">
                    <h3 className="font-bold text-brand-text mb-6">SEO Score Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: '0-40', count: 1 },
                          { name: '41-60', count: 2 },
                          { name: '61-80', count: 5 },
                          { name: '81-100', count: 12 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#667a91'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#667a91'}} />
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                          <Bar dataKey="count" fill="#00b0f0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="cloud-card p-6">
                    <h3 className="font-bold text-brand-text mb-6">Optimization Tips</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
                        <h4 className="font-bold text-brand-blue text-sm mb-1">Focus Keywords</h4>
                        <p className="text-xs text-brand-slate">Ensure your primary keyword appears in the first 100 words of your content.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-brand-green/5 border border-brand-green/10">
                        <h4 className="font-bold text-brand-green text-sm mb-1">Internal Linking</h4>
                        <p className="text-xs text-brand-slate">Link to at least 2 other relevant pages on your site to improve crawlability.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-brand-orange/5 border border-brand-orange/10">
                        <h4 className="font-bold text-brand-orange text-sm mb-1">Mobile Responsiveness</h4>
                        <p className="text-xs text-brand-slate">Check your "About Us" page on mobile; common layout shifts detected.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="flex h-[calc(100vh-120px)] bg-white rounded-3xl overflow-hidden border border-brand-sky/20 shadow-sm">
                {/* Discord-style Sidebar */}
                <div className="w-64 bg-[#f2f3f5] flex flex-col border-r border-brand-sky/10">
                  <div className="p-4 border-b border-brand-sky/10 bg-white/50 backdrop-blur-sm">
                    <h2 className="font-bold text-brand-text flex items-center gap-2">
                      <StickyNote size={18} className="text-brand-blue" />
                      Knowledge Base
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    {noteCategories.map((category) => (
                      <div key={category.id} className="space-y-1">
                        <button className="flex items-center gap-1 text-[11px] font-bold text-brand-slate uppercase tracking-wider w-full px-2 hover:text-brand-text transition-colors group">
                          <ChevronDown size={12} className="group-hover:scale-110 transition-transform" />
                          {category.name}
                        </button>
                        <div className="space-y-0.5">
                          {category.pages.map((page) => (
                            <button
                              key={page.id}
                              onClick={() => setSelectedNoteId(page.id)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium transition-all group",
                                selectedNoteId === page.id 
                                  ? "bg-brand-blue/10 text-brand-blue shadow-sm" 
                                  : "text-brand-slate hover:bg-brand-sky/10 hover:text-brand-text"
                              )}
                            >
                              <Hash size={16} className={cn(
                                "transition-colors",
                                selectedNoteId === page.id ? "text-brand-blue" : "text-brand-slate/50 group-hover:text-brand-slate"
                              )} />
                              <span className="truncate">{page.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-brand-blue/5 border-t border-brand-sky/10">
                    <button className="w-full py-2 bg-brand-blue text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                      <Plus size={14} /> New Channel
                    </button>
                  </div>
                </div>

                {/* Notion-style Editor */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                  {activeNote ? (
                    <>
                      <div className="h-48 w-full bg-gradient-to-r from-brand-blue/20 via-brand-sky/20 to-brand-magenta/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute -bottom-12 left-12 w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white">
                          <FileText size={40} className="text-brand-blue" />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto px-12 pt-16 pb-12">
                        <div className="max-w-3xl mx-auto space-y-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 text-brand-slate text-sm font-medium">
                              <Folder size={16} />
                              <span>{noteCategories.find(c => c.pages.some(p => p.id === selectedNoteId))?.name}</span>
                              <ChevronRight size={14} />
                              <span className="text-brand-text">{activeNote.title}</span>
                            </div>
                            <h1 className="text-5xl font-extrabold text-brand-text tracking-tight leading-tight">
                              {activeNote.title}
                            </h1>
                            <div className="flex items-center gap-4 text-xs text-brand-slate font-bold uppercase tracking-widest border-b border-brand-sky/10 pb-6">
                              <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                Last edited 2 hours ago
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users size={14} />
                                Shared with 3 people
                              </div>
                            </div>
                          </div>
                          
                          <div className="prose prose-slate max-w-none">
                            <div className="markdown-body">
                              <ReactMarkdown>{activeNote.content}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                      <div className="w-20 h-20 bg-brand-sky/20 rounded-3xl flex items-center justify-center mb-6">
                        <StickyNote size={40} className="text-brand-blue" />
                      </div>
                      <h2 className="text-2xl font-bold text-brand-text mb-2">Select a Note</h2>
                      <p className="text-brand-slate max-w-xs">Choose a channel from the sidebar to view or edit your notes.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'dashboard' && activeTab !== 'notes' && activeTab !== 'tasks' && activeTab !== 'studio' && activeTab !== 'finances' && activeTab !== 'targets' && activeTab !== 'briefing' && activeTab !== 'calendar' && activeTab !== 'gmail' && activeTab !== 'seo' && (
              <div className="cloud-card p-12 min-h-[600px] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-brand-sky/20 rounded-full flex items-center justify-center mb-6">
                  {navItems.find(i => i.id === activeTab)?.icon && React.createElement(navItems.find(i => i.id === activeTab)!.icon, { size: 48, className: "text-brand-blue" })}
                </div>
                <h2 className="text-3xl font-bold text-brand-text mb-4">{navItems.find(i => i.id === activeTab)?.label}</h2>
                <p className="text-brand-slate max-w-md text-lg">
                  This section is currently being optimized for your scaling needs. Check back soon for the full premium experience.
                </p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-8 px-8 py-3 bg-brand-blue text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
