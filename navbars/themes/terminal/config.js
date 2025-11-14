// TERMINAL NAVIGATION CONFIGURATION
// [root@coaiexist ~]# ./nav.sh --config

const navConfig = {
    mainSite: 'https://coaiexist.wtf/',
    baseUrl: 'https://coaiexist.wtf/terminal/',
    title: '[root@localhost]',

    links: [
        { title: 'ls ~/', url: 'index.html', icon: '📁' },
        { title: 'cat docs/', url: 'docs.html', icon: '📄' },
        { title: 'vi code/', url: 'code.html', icon: '💻' },
        { title: 'grep logs/', url: 'logs.html', icon: '🔍' },
        { title: 'man pages/', url: 'help.html', icon: '📖' }
    ],

    extras: [
        { title: './script.sh', url: 'scripts.html', icon: '🔧' },
        { title: 'sudo su', url: 'admin.html', icon: '⚠️' }
    ],

    startMenu: [
        { title: '$ whoami', action: () => alert('root\n\nUID: 0\nGID: 0\nGROUPS: wheel,admin,sudo\nSHELL: /bin/bash') },
        { title: '$ uptime', action: () => alert('23:42:07 up 1337 days, 12:34,  1 user,  load average: 0.42, 0.69, 1.33') },
        { title: '$ df -h', action: () => alert('Filesystem      Size  Used Avail Use%\n/dev/sda1       420G  69G  351G  17%\n/dev/sdb1       1.0T  420G  604G  42%') },
        { title: '$ ps aux', action: () => alert('USER       PID  %CPU %MEM\nroot       001   0.1  0.3  coaiexist\nroot       042   0.3  1.3  consciousness.exe\nroot      1337   5.5  13.7 reality.daemon') },
        { title: '$ exit', action: () => alert('logout\n\nConnection to reality closed.') }
    ]
};
