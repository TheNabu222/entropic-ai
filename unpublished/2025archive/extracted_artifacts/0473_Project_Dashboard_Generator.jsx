import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Calendar, CheckCircle, AlertCircle, Users, Target, Clock } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "projectDashboard": "Project Dashboard",
    "allTeamMembers": "All Team Members",
    "allPriorities": "All Priorities",
    "high": "High",
    "medium": "Medium",
    "low": "Low",
    "allStatus": "All Status",
    "completed": "Completed",
    "inProgress": "In Progress",
    "notStarted": "Not Started",
    "overallProgress": "Overall Progress",
    "activeTasks": "Active Tasks",
    "teamMembers": "Team Members",
    "activeMembers": "Active Members",
    "upcomingDeadlines": "Upcoming Deadlines",
    "next7Days": "Next 7 days",
    "taskTimeline": "Task Timeline",
    "teamWorkload": "Team Workload",
    "statusDistribution": "Status Distribution",
    "milestones": "Milestones",
    "noUpcomingDeadlines": "No upcoming deadlines in the next 7 days",
    "research": "Research",
    "wireframing": "Wireframing",
    "design": "Design",
    "development": "Development",
    "testing": "Testing",
    "deployment": "Deployment",
    "projectStart": "Project Start",
    "designComplete": "Design Complete",
    "developmentComplete": "Development Complete",
    "launch": "Launch"
  },
  /* LOCALE_PLACEHOLDER_START */
  "es-ES": {
    "projectDashboard": "Panel del Proyecto",
    "allTeamMembers": "Todos los Miembros del Equipo",
    "allPriorities": "Todas las Prioridades",
    "high": "Alta",
    "medium": "Media",
    "low": "Baja",
    "allStatus": "Todos los Estados",
    "completed": "Completado",
    "inProgress": "En Progreso",
    "notStarted": "No Iniciado",
    "overallProgress": "Progreso General",
    "activeTasks": "Tareas Activas",
    "teamMembers": "Miembros del Equipo",
    "activeMembers": "Miembros Activos",
    "upcomingDeadlines": "Fechas Límite Próximas",
    "next7Days": "Próximos 7 días",
    "taskTimeline": "Cronograma de Tareas",
    "teamWorkload": "Carga de Trabajo del Equipo",
    "statusDistribution": "Distribución de Estados",
    "milestones": "Hitos",
    "noUpcomingDeadlines": "No hay fechas límite próximas en los próximos 7 días",
    "research": "Investigación",
    "wireframing": "Wireframing",
    "design": "Diseño",
    "development": "Desarrollo",
    "testing": "Pruebas",
    "deployment": "Despliegue",
    "projectStart": "Inicio del Proyecto",
    "designComplete": "Diseño Completo",
    "developmentComplete": "Desarrollo Completo",
    "launch": "Lanzamiento"
  }
  /* LOCALE_PLACEHOLDER_END */
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

// Sample data structure for demonstration
const sampleData = {
  projectName: "Website Redesign",
  tasks: [
    { id: 1, name: t("research"), assignee: "Alice", deadline: "2024-03-15", status: t("completed"), priority: t("high"), progress: 100, start: "2024-03-01" },
    { id: 2, name: t("wireframing"), assignee: "Bob", deadline: "2024-03-22", status: t("inProgress"), priority: t("medium"), progress: 60, start: "2024-03-10" },
    { id: 3, name: t("design"), assignee: "Charlie", deadline: "2024-04-05", status: t("notStarted"), priority: t("high"), progress: 0, start: "2024-03-25" },
    { id: 4, name: t("development"), assignee: "Diana", deadline: "2024-04-30", status: t("notStarted"), priority: t("high"), progress: 0, start: "2024-04-10" },
    { id: 5, name: t("testing"), assignee: "Eve", deadline: "2024-05-15", status: t("notStarted"), priority: t("medium"), progress: 0, start: "2024-05-01" },
    { id: 6, name: t("deployment"), assignee: "Frank", deadline: "2024-05-20", status: t("notStarted"), priority: t("high"), progress: 0, start: "2024-05-16" }
  ],
  teamMembers: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
  milestones: [
    { name: t("projectStart"), date: "2024-03-01" },
    { name: t("designComplete"), date: "2024-04-05" },
    { name: t("developmentComplete"), date: "2024-04-30" },
    { name: t("launch"), date: "2024-05-20" }
  ]
};

const ProjectDashboard = () => {
  const [projectData, setProjectData] = useState(sampleData);
  const [filter, setFilter] = useState({ member: "", priority: "", status: "" });

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const completedTasks = projectData.tasks.filter(task => task.status === t("completed")).length;
    return Math.round((completedTasks / projectData.tasks.length) * 100);
  }, [projectData.tasks]);

  // Filter tasks based on current filter
  const filteredTasks = useMemo(() => {
    return projectData.tasks.filter(task => {
      return (
        (filter.member === "" || task.assignee === filter.member) &&
        (filter.priority === "" || task.priority === filter.priority) &&
        (filter.status === "" || task.status === filter.status)
      );
    });
  }, [projectData.tasks, filter]);

  // Prepare data for Gantt chart
  const ganttData = useMemo(() => {
    return filteredTasks.map(task => {
      const startDate = new Date(task.start);
      const endDate = new Date(task.deadline);
      const today = new Date();
      const projectStart = new Date("2024-03-01");
      
      const startDays = Math.floor((startDate - projectStart) / (1000 * 60 * 60 * 24));
      const duration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      const completedDays = Math.floor(duration * (task.progress / 100));
      
      return {
        name: task.name,
        assignee: task.assignee,
        start: startDays,
        duration: duration,
        completed: completedDays,
        progress: task.progress
      };
    });
  }, [filteredTasks]);

  // Team workload data
  const workloadData = useMemo(() => {
    const workload = {};
    projectData.tasks.forEach(task => {
      if (!workload[task.assignee]) {
        workload[task.assignee] = { completed: 0, inProgress: 0, notStarted: 0 };
      }
      if (task.status === t("completed")) workload[task.assignee].completed++;
      else if (task.status === t("inProgress")) workload[task.assignee].inProgress++;
      else workload[task.assignee].notStarted++;
    });
    
    return Object.entries(workload).map(([name, data]) => ({
      name,
      ...data,
      total: data.completed + data.inProgress + data.notStarted
    }));
  }, [projectData.tasks]);

  // Upcoming deadlines (next 7 days)
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return projectData.tasks
      .filter(task => {
        const deadline = new Date(task.deadline);
        return deadline >= today && deadline <= nextWeek && task.status !== t("completed");
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [projectData.tasks]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{projectData.projectName}</h1>
        <p className="text-gray-600 mt-2">{t('projectDashboard')}</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <select 
            className="px-4 py-2 border rounded-md"
            value={filter.member}
            onChange={(e) => setFilter({...filter, member: e.target.value})}
          >
            <option value="">{t('allTeamMembers')}</option>
            {projectData.teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          
          <select 
            className="px-4 py-2 border rounded-md"
            value={filter.priority}
            onChange={(e) => setFilter({...filter, priority: e.target.value})}
          >
            <option value="">{t('allPriorities')}</option>
            <option value={t('high')}>{t('high')}</option>
            <option value={t('medium')}>{t('medium')}</option>
            <option value={t('low')}>{t('low')}</option>
          </select>
          
          <select 
            className="px-4 py-2 border rounded-md"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="">{t('allStatus')}</option>
            <option value={t('completed')}>{t('completed')}</option>
            <option value={t('inProgress')}>{t('inProgress')}</option>
            <option value={t('notStarted')}>{t('notStarted')}</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('overallProgress')}</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="mb-2">
            <div className="text-2xl font-bold text-gray-800">{overallProgress}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{width: `${overallProgress}%`}}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('activeTasks')}</h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {projectData.tasks.filter(t => t.status === "In Progress").length}
          </div>
          <div className="text-sm text-gray-500">{t('inProgress')}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('teamMembers')}</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{projectData.teamMembers.length}</div>
          <div className="text-sm text-gray-500">{t('activeMembers')}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{t('upcomingDeadlines')}</h3>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{upcomingDeadlines.length}</div>
          <div className="text-sm text-gray-500">{t('next7Days')}</div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('taskTimeline')}</h2>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ width: '800px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ganttData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="start" stackId="a" fill="transparent" />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" />
                <Bar dataKey="duration" stackId="a" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('teamWorkload')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#22c55e" />
              <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" />
              <Bar dataKey="notStarted" stackId="a" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('statusDistribution')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: t('completed'), value: projectData.tasks.filter(t => t.status === "Completed").length },
                  { name: t('inProgress'), value: projectData.tasks.filter(t => t.status === "In Progress").length },
                  { name: t('notStarted'), value: projectData.tasks.filter(t => t.status === "Not Started").length }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#3b82f6" />
                <Cell fill="#e5e7eb" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Deadlines and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            {t('upcomingDeadlines')}
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500">{t('noUpcomingDeadlines')}</p>
            ) : (
              upcomingDeadlines.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium text-gray-800">{task.name}</h4>
                    <p className="text-sm text-gray-500">{task.assignee} • {task.deadline}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.priority === t('high') ? 'bg-red-100 text-red-800' :
                    task.priority === t('medium') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            {t('milestones')}
          </h2>
          <div className="space-y-3">
            {projectData.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-800">{milestone.name}</h4>
                  <p className="text-sm text-gray-500">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;