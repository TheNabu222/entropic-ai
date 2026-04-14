fetch('https://aqxrogaltuwtlparwdkq.supabase.co/rest/v1/rpc/increment_page_view', {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeHJvZ2FsdHV3dGxwYXJ3ZGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDY0NzAsImV4cCI6MjA3NzY4MjQ3MH0.qvkQaoQa7MaN7drGHKGxU3c1KnTQOdTH022MynR6fzI',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeHJvZ2FsdHV3dGxwYXJ3ZGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDY0NzAsImV4cCI6MjA3NzY4MjQ3MH0.qvkQaoQa7MaN7drGHKGxU3c1KnTQOdTH022MynR6fzI',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ p_page_path: '/test', p_should_increment: false })
}).then(r => r.json()).then(d => console.log('Response:', d))
