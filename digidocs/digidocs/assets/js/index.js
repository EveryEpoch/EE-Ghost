;"use strict";
document.addEventListener("DOMContentLoaded", function () {
    /*=====================================================
        responsive embed
    =====================================================*/
    reframe('iframe:not(.no-resize)');
    /*=====================================================
        Mobile menu
    =====================================================*/
    var tBtn = document.getElementById('menu-toggle');
    
    tBtn.onclick = function(e) {
        e.preventDefault();
        document.body.classList.toggle('js-mobile-menu-opened');
        tBtn.classList.toggle('menu-icon-close');
    };
    document.getElementById('backdrop')
    .onclick = function() {
        document.body.classList.toggle('js-mobile-menu-opened');
        tBtn.classList.toggle('menu-icon-close');
    };
    /*=====================================================
        Show all topic button
    =====================================================*/
    var ShowAllBtn = document.querySelector('.js-show-all-topic');
    var topicCard = document.getElementsByClassName('topic-card');
    if(null !== topicCard && topicCard.length <=4 && null !== ShowAllBtn) {
        console.log(topicCard.length);
        ShowAllBtn.style.display = 'none';
    }
    if (null !== ShowAllBtn) {
        ShowAllBtn.addEventListener('click', function() {
            var hiddenCards = document.querySelectorAll('.js-cards.hidden');
            for( var i=0; i< hiddenCards.length; i++) {
                hiddenCards[i].classList.remove('hidden');
            }
            this.style.display = 'none';
        })
    }

    /*=====================================================
        gallery
    =====================================================*/
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });
    mediumZoom('.single-post-wrap img', {
        margin: 30
    });

    /*=====================================================
        Search
    =====================================================*/
    var searchForm = document.querySelector('.js-search-form');
    if(searchForm!== null) {
        var searchInput = searchForm.querySelector('.js-search-input');
        var searchResult =document.getElementById('search-results');
        var noResult =document.getElementById('no-result');
        var searchinGhost = new SearchinGhost({
            key: apiKey,
            inputId: ['search-bar'],
            outputId: ['search-results'],
            outputChildsType: false,
            limit: 50,
            postsFields: ['title', 'url', 'excerpt', 'custom_excerpt', 'published_at'],
            postsExtraFields: ['tags'],
            template: function(post) {
                var o = '<div id="" class="result-item">';
                o += '<a href="' + post.url + '"><div class="header">';
                o += '<div class="title">' + post.title + '</div>';
                if (post.tags.length > 0) {
                    o += ' - <span class="tag">' + post.tags[0].name + '</span></div>';
                }
                o += '<div class="excerpt">' + post.excerpt + '</div>';
                return o;
            },
            onSearchEnd: function(posts) {
                if(posts.length > 0) {
                    noResult.classList.remove('visible');
                    searchResult.classList.add('visible');
                } else {
                    searchResult.classList.remove('visible');
                    if(searchInput.value !== undefined && searchInput.value !== '') {
                        noResult.classList.add('visible');
                    } else {
                        noResult.classList.remove('visible');
                    }
                }
            }
        });
        
        searchInput.addEventListener('focus', function() {
            if (searchInput.value !== undefined && searchInput.value !== '') {
                if (searchResult.innerHTML) {
                    searchResult.classList.add('visible');
                } else {
                    noResult.classList.add('visible');
                }
            }
        });
        searchInput.addEventListener('blur', function() {
            document.addEventListener('click', hideResult);
            function hideResult(e) {
                if (!searchResult.contains(e.target)) {
                    searchResult.classList.remove('visible');
                    noResult.classList.remove('visible');
                    document.removeEventListener('click', hideResult);
                }
            }
        });
    }
    /*=====================================================
        scroll top
    =====================================================*/
    btnScrollTop = document.querySelector('#back-to-top');
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            btnScrollTop.style.opacity = 1;
          } else {
            btnScrollTop.style.opacity = 0;
          }
    });
    btnScrollTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
    /*=====================================================
        tooltip
    =====================================================*/
    tlite(function (el) {
        return el.classList.contains('tooltip') && { grav: 's' }
    });
    /*=====================================================
        copy link
    =====================================================*/
    new ClipboardJS('.js-copy-link')
    .on('success', function(e) {
        showNotification('notification-copy-link');
    });
    function showNotification(notificationClass) {
        var notification = document.querySelector('.'+notificationClass);
        notification.classList.add('visible');
        setTimeout(function() {
            notification.classList.remove('visible');
        }, 4000);
    }
    /*=====================================================
        print
    =====================================================*/
    var printBtn = document.querySelector('.js-print');
    if(null !== printBtn) {
        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    }
    /*=====================================================
    prev next
    =====================================================*/
    var items = document.querySelectorAll('.post-link');
    var post = document.getElementById('single-post-wrap');
    var prevPost, nextPost;
    if(0 !== items.length && null !== post) {
        items.forEach(function(el, key) {
            if (el.classList.contains('current')) {
                if (items[key-1] !== undefined) {
                    prevPost = {
                        link: items[key-1].children[0].getAttribute('href'),
                        title: items[key-1].children[0].innerHTML,
                    }
                }
                if (items[key+1] !== undefined) {
                    nextPost = {
                        link: items[key+1].children[0].getAttribute('href'),
                        title: items[key+1].children[0].innerHTML,
                    }
                }
            }
        })
        if (prevPost !== undefined) {
            var prev = document.getElementById('prev-post');
            prev.getElementsByTagName('a')[0].setAttribute('href', prevPost.link);
            prev.getElementsByClassName('title')[0].innerHTML = prevPost.title;
            prev.classList.add('visible');
        }
        if (nextPost !== undefined) {
            var next = document.getElementById('next-post');
            next.getElementsByTagName('a')[0].setAttribute('href', nextPost.link);
            next.getElementsByClassName('title')[0].innerHTML = nextPost.title;
            next.classList.add('visible');
        }
        if(prevPost === undefined && nextPost === undefined) {
            var prevNextWrap = document.querySelector('.prev-next-wrap');
            if(prevNextWrap !== null) {
                prevNextWrap.style.display = 'none';
            }
        }
    }
    /*=====================================================
        heading links
    =====================================================*/
    var postContent = document.getElementById('post-content');
    if (postContent !== undefined && postContent !== null && postContent.classList.contains('no-access') !== true) {
        if( postContent.classList.contains('changelog-template')) {
            var headings = postContent.querySelectorAll('h2');
        }else {
            var headings = postContent.querySelectorAll('h1, h2:not(.kg-header-card-header), h3:not(.kg-header-card-subheader)');
        }
        headings.forEach(function(heading){
            var link = document.createElement('a');
            link.href = '#' + heading.id;
            link.classList.add('js-anchor')
            icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.29 9.29l-4 4a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4-4a1 1 0 0 0-1.42-1.42z"/><path d="M12.28 17.4L11 18.67a4.2 4.2 0 0 1-5.58.4 4 4 0 0 1-.27-5.93l1.42-1.43a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-1.27 1.28a6.15 6.15 0 0 0-.67 8.07 6.06 6.06 0 0 0 9.07.6l1.42-1.42a1 1 0 0 0-1.42-1.42z"/><path d="M19.66 3.22a6.18 6.18 0 0 0-8.13.68L10.45 5a1.09 1.09 0 0 0-.17 1.61 1 1 0 0 0 1.42 0L13 5.3a4.17 4.17 0 0 1 5.57-.4 4 4 0 0 1 .27 5.95l-1.42 1.43a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l1.42-1.42a6.06 6.06 0 0 0-.6-9.06z"/></svg>';
            link.innerHTML = icon;
            heading.appendChild(link);
        });
    }

    /*=====================================================
        version list
    =====================================================*/
    if (postContent !== undefined && postContent !== null) {
        var headings = postContent.querySelectorAll('h2');
        var list = document.getElementById('version-list');
        if (list !== null) {
            var pattern = /\d+(\.\d+){2,}/g;
            headings.forEach(function(heading){
                result = heading.textContent.match(pattern);
                heading.id
                var l = document.createElement('li');
                var a = document.createElement('a');
                a.href = '#' + heading.id;
                a.classList.add('version-link');
                a.textContent = result;
                l.appendChild(a);
                list.appendChild(l);
            })

            var menuItems = list.querySelectorAll('.version-link');
            var scrollItems = [];
            menuItems.forEach(function(menuItem) {
                var scrollItem = document.getElementById(menuItem.getAttribute('href').slice(1));
                scrollItems.push(scrollItem);
            })
            document.addEventListener('scroll', function() {
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;;
                var currId = '';
                var limit = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight;
                scrollItems.forEach(function(scrollItem) {
                    var rect = scrollItem.getBoundingClientRect();
                    var itemTop = rect.top + scrollTop -40;
                    if (itemTop <= scrollTop) {
                        currId = scrollItem.id;
                    } else if ( limit == scrollTop){
                        currId = scrollItems[scrollItems.length-1].id;
                    }
                })
                menuItems.forEach(function(menuItem){
                    if(currId === menuItem.getAttribute('href').slice(1)) {
                        menuItem.parentNode.classList.add('current')
                    } else {
                        menuItem.parentNode.classList.remove('current');
                    }
                })
            })
        }
    }
    /*=====================================================
        Responsive table
    =====================================================*/
    var tables = document.querySelectorAll('table');
    if (tables.length > 0) {
        tables.forEach(function(table) {
            var wrapper = document.createElement('div')
            wrapper.classList.add('table-responsive');
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        })
    }
    /*=====================================================
    Sticky sidebar
    =====================================================*/
    window.addEventListener('load', function() {
        if(null !== document.querySelector('.js-sidebar')) {
            var sidebar = new StickySidebar('.js-sidebar', {
                containerSelector: '.js-main-content-area',
                innerWrapperSelector: '.js-sidebar-inner',
                topSpacing: 24,
                bottomSpacing: 24,
                resizeSensor: true
            });
        }
    });
    /*=====================================================
        subscribe-notifications
    =====================================================*/
    // Parse the URL parameter
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    // Give the parameter a variable name
    var action = getParameterByName('action');
    var stripe = getParameterByName('stripe');
    var success = getParameterByName('success');
    if (action == 'subscribe') {
        showNotification('notification-subscribe');
        cleanTheUri();
    }
    if (action == 'signup') {
        window.location = '/signup/?action=checkout';
    }
    if (action == 'checkout') {
        showNotification('notification-signup');
        cleanTheUri();
    }
    if (action == 'signin') {
        showNotification('notification-signin');
        cleanTheUri();
    }
    if (action == 'signin' && success== 'false') {
        showNotification('notification-signin-failure');
        cleanTheUri();
    }
    if (stripe == 'success') {
        showNotification('notification-checkout');
        cleanTheUri();
    }
    if(stripe == 'billing-update-success') {
        showNotification('notification-billing-success');
        cleanTheUri();
    }
    if(stripe == 'billing-update-cancel') {
        showNotification('notification-billing-cancel');
        cleanTheUri();
    }

    function cleanTheUri() {
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
            var cleanUri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, cleanUri);
        }
    }
});
/*=====================================================
    toc
=====================================================*/
var postContent = document.getElementById('post-content');
console.log()
if (postContent !== undefined && postContent !== null && postContent.classList.contains('no-access') !== true) {
    var tocContainer = document.getElementById('toc-wrap');
    var headings = postContent.querySelectorAll('h2:not(.kg-header-card-header), h3:not(.kg-header-card-subheader)');
    if (tocContainer !== null && headings.length > 0) {
        var u = document.createElement('ul');
        u.classList.add('toc');
        headings.forEach(function(heading){
            var l = document.createElement('li');
            var a = document.createElement('a');
            l.classList.add('toc-'+heading.nodeName.toLowerCase());
            a.href = '#' + heading.id;
            a.textContent = heading.textContent;
            l.appendChild(a);
            u.appendChild(l);
            
        })
        tocContainer.appendChild(u);
        tocContainer.classList.add('visible');
        // smooth scroll
        var anchors = tocContainer.querySelectorAll('a');
        anchors.forEach(function(anchor){
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                var  hash = anchor.getAttribute('href');
                var target = document.getElementById(hash.slice(1));
                var topSpace = 16;
                var scrollPosition = target.getBoundingClientRect().top + window.scrollY - topSpace;
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
                history.pushState(null, null, hash);
                window.addEventListener('scroll', setFocus);
                function setFocus() {
                    var currentScrollOffset = window.pageYOffset || document.documentElement.scrollTop
                    if (currentScrollOffset === Math.round(scrollPosition)) {
                        target.querySelector('a').focus();
                        window.removeEventListener('scroll', setFocus);
                    }
                }
            });
        });
    }
}
/*=====================================================
    Disqus lazy load
=====================================================*/
var disqusContainer =document.querySelector('.disqus-comment-wrap');
if(disqusContainer) {
    var disqusOptions = {
        scriptUrl: '//' + disqus_shortname + '.disqus.com/embed.js',
        laziness: 1,
        disqusConfig: function(){
        this.page.url         = pageUrl
        this.page.identifier  = pageIdentifier;
        }
    };
    disqusLoader( '.disqus-comment-wrap', disqusOptions );
}