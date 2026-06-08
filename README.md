<h1>React-Laravel-Inertia-Shadcdn</h1>

<h2>Prerequisites</h2>
<p>Ensure you have the following installed on your system:</p>
<ul>
  <li><a href="https://getcomposer.org/" target="_blank">Composer</a></li>
  <li><a href="https://www.php.net/" target="_blank">PHP</a></li>
  <li><a href="https://nodejs.org/" target="_blank">Node.js & npm</a></li>
</ul>

<h2>Installation Steps</h2>

<ol>
  <li><strong>Install PHP dependencies:</strong>
    <pre><code>composer install</code></pre>
  </li>
  
  <li><strong>Copy the environment configuration file:</strong>
    <pre><code>cp .env.example .env</code></pre>
    <p>Windows alternatives:</p>
    <pre><code>copy .env.example .env</code></pre>
    <pre><code>Copy-Item .env.example .env</code></pre>
  </li>
  
  <li><strong>Generate the application key:</strong>
    <pre><code>php artisan key:generate</code></pre>
  </li>
  
  <li><strong>Install Node.js dependencies:</strong>
    <pre><code>npm install</code></pre>
  </li>
  
  <li><strong>Run database migrations:</strong>
    <pre><code>php artisan migrate</code></pre>
  </li>
  
  <li><strong>Start the dev servers:</strong>
    <pre><code>composer run dev</code></pre>
    <p>On Windows, use <code>composer run dev:win</code> (see below).</p>
  </li>
</ol>

<p>Your application should now be running. Open your browser and navigate to <code>http://127.0.0.1:8000/</code> to access it.</p>

<h2>Development (Windows)</h2>
<p>
  On Windows, <code>composer run dev</code> may fail because Laravel Pail requires the <code>pcntl</code> extension (not available on typical Windows PHP installs).
</p>
<ul>
  <li><strong>Use:</strong> <pre><code>composer run dev:win</code></pre></li>
  <li><strong>SSR variant:</strong> <pre><code>composer run dev:ssr:win</code></pre></li>
</ul>

<h2>Lighthouse (Performance + Best Practices)</h2>
<p>
  For accurate Lighthouse numbers, you need to test the built assets (not Vite dev/HMR). Vite dev mode creates a <code>public/hot</code> file; if it exists, Laravel will serve dev assets.
</p>

<ol>
  <li>
    <strong>Build production assets:</strong>
    <pre><code>npm run build</code></pre>
  </li>
  <li>
    <strong>Ensure Vite HMR is not enabled:</strong>
    <p>Delete <code>public/hot</code> if present.</p>
  </li>
  <li>
    <strong>Start the app:</strong>
    <pre><code>php artisan serve</code></pre>
    <p>
      Note: this template includes a project-root <code>server.php</code> router that helps the local PHP server serve static assets with caching + gzip, which makes local Lighthouse closer to production.
    </p>
  </li>
  <li>
    <strong>Run Lighthouse:</strong>
    <pre><code>composer run lighthouse:run</code></pre>
    <p>
      Reports are written to <code>storage/app/</code> as:
      <code>lighthouse.mobile.report.html</code>, <code>lighthouse.mobile.report.json</code>,
      <code>lighthouse.desktop.report.html</code>, <code>lighthouse.desktop.report.json</code>.
    </p>
  </li>
</ol>
