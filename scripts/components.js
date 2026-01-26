//   ◇─────────◇      ◇─────◇     ◇─────────◇
// JSON cache for courses data
let coursesCache = null;

// Dynamic Page Title Setup
// Automatically sets page title based on course-id attribute
async function setPageTitle() {
    // Look for any element with a course-id attribute
    const elementWithCourseId = document.querySelector('[course-id]');

    if (!elementWithCourseId) return; // Not a course page

    const courseId = elementWithCourseId.getAttribute('course-id');

    try {
        const data = await getCourses();
        if (!data) return;

        const course = data.courses.find(c => c.id === courseId);
        if (course && course.fullCourseName) {
            document.title = course.fullCourseName;
        }
    } catch (error) {
        console.error('Failed to set page title:', error);
    }
}

// Dynamic Favicon Setup
// Automatically adds favicon to every page
function setFavicon() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = '/img/favicon.ico';
    document.head.appendChild(link);
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setPageTitle();
        setFavicon();
    });
} else {
    setPageTitle();
    setFavicon();
}

async function getCourses() {
    if (!coursesCache) {
        try {
            // Detect if we're in a subdirectory and adjust path
            const isInSubdir = window.location.pathname.includes('/courses/');
            const basePath = isInSubdir ? '../' : '';
            const response = await fetch(`${basePath}scripts/data/courses.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            coursesCache = await response.json();
        } catch (error) {
            console.error('Failed to load courses:', error);
            return null;
        }
    }
    return coursesCache;
}

//   ◇─────────◇      ◇─────◇     ◇─────────◇
//    *                                    *
//     *     🅢🅘🅣🅔 🅒🅞🅜🅟🅞🅝🅔🅝🅣🅢    *
//    *                                    *
//   ◇─────────◇      ◇─────◇     ◇─────────◇ 

//   Reusable elements for the site made using
//   JS web components.
//   https://developer.mozilla.org/en-US/docs/Web/API/Web_components#custom_elements_2
//
//   ◇─────────◇      ◇─────◇     ◇─────────◇



// SITE HEADER   ◇─────◇ 
//    
// The overall website header with dynamic course heading.
// syntax: <site-header course-id="specialTopics"></site-header>

class SiteHeader extends HTMLElement {
    async connectedCallback() {
        const courseId = this.getAttribute('course-id');

        // If no course-id, show a default heading
        if (!courseId) {
            this.innerHTML = `
        <header role="banner">
          <h1 class="rainbow-text">Teaching Site</h1>
        </header>
      `;
            return;
        }

        // Fetch courses data
        const data = await getCourses();

        if (!data) {
            this.innerHTML = `
        <header role="banner">
          <h1 class="rainbow-text">Course</h1>
        </header>
      `;
            return;
        }

        // Find the specific course
        const course = data.courses.find(c => c.id === courseId);

        if (!course) {
            console.error(`Course with id "${courseId}" not found`);
            this.innerHTML = `
        <header role="banner">
          <h1 class="rainbow-text">Course Not Found</h1>
        </header>
      `;
            return;
        }

        // Use courseHeading if available, otherwise fall back to fullCourseName
        const heading = course.courseHeading || course.fullCourseName;

        // Add project briefs link if available
        const briefsLink = course.projectBriefsUrl ?
            `<p><a href="${course.projectBriefsUrl}" target="_blank" class="briefs-link">View Project Briefs ></a></p>` :
            '';

        this.innerHTML = `
      <header role="banner">
        <h1 class="rainbow-text">${heading}</h1>
        <p>${course.courseDescription}</p>
        ${briefsLink}
      </header>
    `;
    }
}
customElements.define('site-header', SiteHeader);




// SITE FOOTER   ◇─────◇ 
//    
// The overall website footer.
// syntax: <site-footer></site-footer>

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <footer role="contentinfo">
        &copy; <current-year></current-year> merethom
        <i class="pixel-star" aria-hidden="true"></i>
        <img src="/img/rainbow-flag.svg" alt="pixel art of a rainbow flag">
        <img src="/img/t-flag.svg" alt="pixel art of the trans pride flag">
      </footer>
    `;
    }
}
customElements.define('site-footer', SiteFooter);




// SITE NAV   ◇─────◇ 
//    
// The overall website navigation with dynamically populated courses menu.
// syntax: <site-nav></site-nav>

class SiteNav extends HTMLElement {
    async connectedCallback() {
        // Fetch courses data
        const data = await getCourses();

        if (!data) {
            this.innerHTML = `
        <nav>
          <ul>
            <li>Error loading navigation</li>
          </ul>
        </nav>
      `;
            return;
        }

        // Generate course links
        const courseLinks = data.courses.map(course =>
            `<li><a href="${course.pageUrl || course.classNotesUrl}">${course.navigationName}</a></li>`
        ).join('');

        this.innerHTML = `
    <nav>
      <h5>classes</h5>
      
      <ul>
        ${courseLinks}
      </ul>
      
      <h5>links</h5>
      <ul>
        <li><a href="/deadlines.html">Deadline Policy</a></li>
        <li><a href="https://teams.microsoft.com/l/chat/0/0?users=%3Cmeredith.thompson1@sheridancollege.ca%3E" target="_blank">Message Me</a></li>
        <li><a href="https://outlook.office365.com/owa/calendar/MeredithThompson@sheridanc.onmicrosoft.com/bookings/" target="_blank">Office Hours</a></li>
      </ul>
       
      </nav>
    `;

        // Restore details state from localStorage
        this.querySelectorAll('details').forEach(details => {
            const isOpen = localStorage.getItem(details.id) === 'true';
            if (isOpen) {
                details.setAttribute('open', '');
            }

            // Save state when toggled
            details.addEventListener('toggle', () => {
                localStorage.setItem(details.id, details.open);
            });
        });
    }
}
customElements.define('site-nav', SiteNav);





//   ◇─────────◇      ◇─────◇     ◇─────────◇
//    *                                    *
//     *    🅣🅔🅧🅣 🅒🅞🅜🅟🅞🅝🅔🅝🅣🅢     *
//    *                                    *
//   ◇─────────◇      ◇─────◇     ◇─────────◇ 

//   Reusable text only elements for the site
//   made using JS web components.
//
//   ◇─────────◇      ◇─────◇     ◇─────────◇



// COURSE INFO   ◇─────◇ 
//    
// Displays course information from courses.json
// syntax: <course-info course-id="specialTopics"></course-info>

class CourseInfo extends HTMLElement {
    async connectedCallback() {
        const courseId = this.getAttribute('course-id');

        // Validate course-id attribute
        if (!courseId) {
            this.innerHTML = `<small>Error: No course-id specified</small>`;
            console.error('CourseInfo component requires a course-id attribute');
            return;
        }

        // Fetch courses data
        const data = await getCourses();

        if (!data) {
            this.innerHTML = `<small>Error: Could not load course data</small>`;
            return;
        }

        // Find the specific course
        const course = data.courses.find(c => c.id === courseId);

        if (!course) {
            this.innerHTML = `<small>Error: Course "${courseId}" not found</small>`;
            console.error(`Course with id "${courseId}" not found in courses.json`);
            return;
        }

        // Program mapping
        const programMap = {
            'ixd': 'sheridan ixd',
            'gd': 'sheridan design',
            'xd': 'sheridan xd',
            'dpd': 'sheridan dpd'
        };

        const programDisplay = programMap[course.program] || course.program;

        // Render the course info
        this.innerHTML = `
      <small>${course.courseCode} ${course.shortCourseName}</small>
      <br>
      <small>${programDisplay} // ${course.term} <current-year></current-year></small>
    `;
    }
}
customElements.define('course-info', CourseInfo);




// COURSE WEEKLY CONTENT   ◇─────◇ 
//    
// Displays weekly course content from course-specific JSON files
// syntax: <course-weekly-content course-id="specialTopics"></course-weekly-content>

class CourseWeeklyContent extends HTMLElement {
    async connectedCallback() {
        const courseId = this.getAttribute('course-id');

        // Validate course-id attribute
        if (!courseId) {
            this.innerHTML = `<p>Error: No course-id specified</p>`;
            console.error('CourseWeeklyContent component requires a course-id attribute');
            return;
        }

        // Convert camelCase courseId to kebab-case for filename
        const fileName = courseId.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        // Fetch the course-specific content JSON
        let contentData;
        try {
            const response = await fetch(`../scripts/data/${fileName}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            contentData = await response.json();
        } catch (error) {
            console.error(`Failed to load content for ${courseId}:`, error);
            this.innerHTML = `<p>Error: Could not load course content for "${fileName}.json"</p>`;
            return;
        }

        // Helper function to convert Figma URLs to embed format
        const getFigmaEmbedUrl = (url) => {
            if (!url) return '';
            // If already an embed URL, return as-is
            if (url.includes('embed.figma.com')) return url;

            try {
                // Parse the URL
                const urlObj = new URL(url);

                // Change domain to embed.figma.com
                urlObj.hostname = 'embed.figma.com';

                // Add embed-host parameter if not present
                if (!urlObj.searchParams.has('embed-host')) {
                    urlObj.searchParams.set('embed-host', 'share');
                }

                return urlObj.toString();
            } catch (error) {
                console.error('Invalid Figma URL:', url, error);
                return url; // Return original if parsing fails
            }
        };

        // Sort weeks in reverse chronological order (newest first)
        const sortedWeeks = [...contentData.weeks].sort((a, b) => b.weekNumber - a.weekNumber);

        // Render weekly content
        const weeksHtml = sortedWeeks.map(week => {
            // Render links if present
            let linksHtml = '';
            if (week.links && week.links.length > 0) {
                const linkItems = week.links.map(link =>
                    `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`
                ).join('');
                linksHtml = `
          <div class="week-links">
            <h4>Links</h4>
            <p>Here are some direct links for this week's content:</p>
            <ul>
              ${linkItems}
            </ul>
          </div>
        `;
            }

            // Render Figma embed if present
            let figmaHtml = '';
            if (week.figmaEmbed) {
                const embedUrl = getFigmaEmbedUrl(week.figmaEmbed);
                figmaHtml = `
          <div class="week-lecture">
            <h4>Lecture</h4>
            <iframe class="figma-embed" src="${embedUrl}" allowfullscreen></iframe>
          </div>
        `;
            }

            return `
        <details class="week-item">
          <summary>Week ${week.weekNumber} (${week.date})</summary>
          <div class="week-content">
            <div class="week-overview">
              <h4>Overview</h4>
              <p>${week.overview}</p>
            </div>
            ${figmaHtml}
            ${linksHtml}
          </div>
        </details>
      `;
        }).join('');

        // Render complete content
        this.innerHTML = `
      <div class="course-content">
      <h2>Weekly Content</h2>
      <p>Here are the links to lectures, figma templates, and other resources for the course.</p>
        <section class="weekly-content">
          ${weeksHtml}
        </section>
      </div>
    `;
    }
}
customElements.define('course-weekly-content', CourseWeeklyContent);



// CURRENT YEAR   ◇─────◇
//    
// It just prints the current year in HTML
// syntax: <current-year></current-year>

class CurrentYear extends HTMLElement {
    connectedCallback() {
        const year = new Date().getFullYear();
        this.textContent = year;
    }
}
customElements.define('current-year', CurrentYear);