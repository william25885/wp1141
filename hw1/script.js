// 最終工作版本的 TypeScript
document.addEventListener('DOMContentLoaded', function () {
    console.log('TypeScript 頁面載入完成，開始設定功能');
    // 設定技能進度條
    function setupSkillBars() {
        var skillBars = document.querySelectorAll('.skill-progress');
        console.log('找到技能進度條數量:', skillBars.length);
        var skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var skillBar_1 = entry.target;
                    var targetWidth_1 = skillBar_1.getAttribute('data-width') || '0%';
                    console.log('進度條進入視窗，目標寬度:', targetWidth_1);
                    setTimeout(function () {
                        skillBar_1.style.width = targetWidth_1;
                        console.log('設定進度條寬度為:', targetWidth_1);
                    }, 200);
                    skillObserver.unobserve(skillBar_1);
                }
            });
        }, { threshold: 0.5 });
        skillBars.forEach(function (bar) {
            console.log('監聽進度條:', bar);
            skillObserver.observe(bar);
        });
    }
    // 設定導航選單
    function setupNavigation() {
        var hamburger = document.querySelector('.hamburger');
        var navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                // 動畫效果
                var bars = hamburger.querySelectorAll('.bar');
                bars.forEach(function (bar, index) {
                    var htmlBar = bar;
                    if (hamburger.classList.contains('active')) {
                        if (index === 0)
                            htmlBar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                        if (index === 1)
                            htmlBar.style.opacity = '0';
                        if (index === 2)
                            htmlBar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                    }
                    else {
                        htmlBar.style.transform = 'none';
                        htmlBar.style.opacity = '1';
                    }
                });
            });
        }
        // 導航連結點擊（現在只有首頁連結）
        var navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var _a;
                e.preventDefault();
                var targetId = ((_a = link.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.substring(1)) || null;
                if (targetId === 'home') {
                    // 滾動到首頁
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                // 關閉行動版選單
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    var bars = hamburger.querySelectorAll('.bar');
                    bars.forEach(function (bar) {
                        var htmlBar = bar;
                        htmlBar.style.transform = 'none';
                        htmlBar.style.opacity = '1';
                    });
                }
            });
        });
    }
    // 設定「了解更多」按鈕的動畫效果
    function setupLearnMoreAnimation() {
        var learnMoreBtn = document.querySelector('.btn-secondary');
        var sections = ['about', 'skills', 'contact'];
        console.log('尋找了解更多按鈕:', learnMoreBtn);
        console.log('目標區塊:', sections);
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('了解更多按鈕被點擊，開始動畫');
                // 直接執行動畫（動畫函數會處理滾動）
                console.log('開始執行漸進動畫');
                animateSections(sections);
            });
        }
        else {
            console.error('找不到了解更多按鈕！');
        }
    }
    // 改善的漸進動畫函數
    function animateSections(sections) {
        console.log('開始執行改善的漸進動畫');
        console.log('要顯示的區塊:', sections);
        // 先顯示所有區塊，但保持隱藏狀態
        sections.forEach(function (sectionId) {
            var section = document.getElementById(sectionId);
            console.log('處理區塊:', sectionId, '元素:', section);
            if (section) {
                section.style.setProperty('display', 'block', 'important');
                section.style.setProperty('opacity', '0', 'important');
                section.style.setProperty('transform', 'translateY(60px)', 'important');
                console.log('設定區塊', sectionId, '為顯示但透明');
            }
            else {
                console.error('找不到區塊:', sectionId);
            }
        });
        // 等待 DOM 更新後再滾動
        setTimeout(function () {
            // 滾動到第一個區塊
            var firstSectionId = sections[0];
            if (firstSectionId) {
                var firstSection = document.getElementById(firstSectionId);
                if (firstSection) {
                    var offsetTop = firstSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    console.log('滾動到第一個區塊，位置:', offsetTop);
                }
            }
        }, 50); // 短暫延遲確保 DOM 更新
        // 依序顯示區塊，使用 CSS 類別而非直接設定樣式
        sections.forEach(function (sectionId, index) {
            var section = document.getElementById(sectionId);
            if (section) {
                setTimeout(function () {
                    console.log("\u986F\u793A\u5340\u584A: ".concat(sectionId));
                    // 移除 inline 樣式，讓 CSS 類別生效
                    section.style.removeProperty('opacity');
                    section.style.removeProperty('transform');
                    section.classList.add('animate');
                    console.log('添加 animate 類別到:', sectionId);
                }, index * 600 + 500); // 每個區塊間隔600ms，第一個500ms後開始
            }
        });
    }
    // 初始化區塊狀態（頁面載入時完全隱藏關於我、技能、聯絡我區塊）
    function initializeSections() {
        console.log('開始初始化區塊狀態 - 完全隱藏區塊');
        var sections = ['about', 'skills', 'contact'];
        sections.forEach(function (sectionId) {
            var section = document.getElementById(sectionId);
            if (section) {
                console.log("\u5B8C\u5168\u96B1\u85CF\u5340\u584A: ".concat(sectionId));
                // 初始狀態：完全隱藏區塊，不佔據任何空間
                section.style.setProperty('display', 'none', 'important');
                section.style.setProperty('opacity', '0', 'important');
                section.style.setProperty('transform', 'translateY(60px)', 'important');
                // 移除 transition 設定，讓 CSS 類別控制動畫
            }
        });
    }
    // 設定滾動條顯示控制
    function setupScrollbarVisibility() {
        var scrollTimeout;
        window.addEventListener('scroll', function () {
            // 添加滾動狀態類別
            document.body.classList.add('scrolling');
            // 清除之前的計時器
            clearTimeout(scrollTimeout);
            // 設定計時器，停止滾動後移除類別
            scrollTimeout = setTimeout(function () {
                document.body.classList.remove('scrolling');
            }, 1000); // 1秒後隱藏滾動條
        });
    }
    // 設定首頁元件動畫 - 改善浮現效果
    function setupHeroAnimations() {
        // 標題動畫 - 頁面載入後立即開始
        setTimeout(function () {
            var title = document.querySelector('.hero-title');
            if (title) {
                title.classList.add('animate');
                console.log('標題動畫開始');
            }
        }, 300); // 0.3秒後開始，更快響應
        // 描述文字動畫 - 標題動畫後開始
        setTimeout(function () {
            var description = document.querySelector('.hero-description');
            if (description) {
                description.classList.add('animate');
                console.log('描述文字動畫開始');
            }
        }, 600); // 0.6秒後開始
        // 按鈕動畫 - 描述文字動畫後開始
        setTimeout(function () {
            var buttons = document.querySelector('.hero-buttons');
            if (buttons) {
                buttons.classList.add('animate');
                console.log('按鈕動畫開始');
            }
        }, 900); // 0.9秒後開始
        // 個人資料卡片動畫 - 按鈕動畫後開始
        setTimeout(function () {
            var heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.classList.add('animate');
                console.log('個人資料卡片動畫開始');
            }
        }, 1200); // 1.2秒後開始
    }
    // 執行設定
    setupSkillBars();
    setupNavigation();
    setupLearnMoreAnimation();
    initializeSections();
    setupScrollbarVisibility();
    setupHeroAnimations();
    console.log('TypeScript 所有功能設定完成');
});
