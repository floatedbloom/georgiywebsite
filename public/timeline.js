class Timeline {
    constructor(element, options = {}) {
        this.timeline = element;
        this.settings = this.extendDefaults(options);
        this.init();
    }

    extendDefaults(options) {
        const defaults = {
            mode: 'vertical',
            forceVerticalMode: 600,
            horizontalStartPosition: 'top',
            moveItems: 1,
            rtlMode: false,
            startIndex: 0,
            verticalStartPosition: 'left',
            verticalTrigger: '15%',
            visibleItems: 3
        };
        return Object.assign({}, defaults, options);
    }

    init() {
        this.setupTimeline();
        this.setupEventListeners();
    }

    setupTimeline() {
        this.timeline.classList.add('timeline');
        this.settings.mode = this.settings.mode === 'horizontal' ? 'horizontal' : 'vertical';
        this.timeline.classList.add(`timeline--${this.settings.mode}`);

        if (this.settings.mode === 'horizontal') {
            this.setupHorizontalTimeline();
            this.checkResponsive();
        } else if (this.settings.mode === 'vertical') {
            this.setupVerticalTimeline();
        }

        window.addEventListener('resize', () => {
            this.checkResponsive();
        });
    }

    setupHorizontalTimeline() {
        const items = this.timeline.querySelector('.timeline__items');
        if (items) {
            items.style.setProperty('--visible-items', this.settings.visibleItems);
            
            const timelineItems = this.timeline.querySelectorAll('.timeline__item');
            if (timelineItems.length > this.settings.visibleItems) {
                const prevBtn = document.createElement('div');
                prevBtn.classList.add('timeline__nav', 'timeline__nav--prev');
                prevBtn.innerHTML = '<span class="sr-only">Previous</span>';
                
                const nextBtn = document.createElement('div');
                nextBtn.classList.add('timeline__nav', 'timeline__nav--next');
                nextBtn.innerHTML = '<span class="sr-only">Next</span>';
                
                this.timeline.appendChild(prevBtn);
                this.timeline.appendChild(nextBtn);
                
                this.setupNavigation();
            }
            
            this.currentIndex = this.settings.rtlMode ? 
                timelineItems.length - this.settings.visibleItems : 
                this.settings.startIndex;
            this.updateHorizontalPosition();
        }
    }

    setupVerticalTimeline() {
        const items = this.timeline.querySelectorAll('.timeline__item');
        items.forEach((item, index) => {
            const position = this.settings.verticalStartPosition === 'left' ? 
                (index % 2 === 0 ? 'left' : 'right') : 
                this.settings.verticalStartPosition === 'right' ? 
                (index % 2 === 0 ? 'right' : 'left') : 'left';
            item.classList.add(`timeline__item--${position}`);
        });
        
        this.checkVerticalItems();
    }

    setupNavigation() {
        const prevBtn = this.timeline.querySelector('.timeline__nav--prev');
        const nextBtn = this.timeline.querySelector('.timeline__nav--next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.movePrev();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.moveNext();
            });
        }
    }

    movePrev() {
        this.currentIndex = Math.max(0, this.currentIndex - this.settings.moveItems);
        this.updateHorizontalPosition();
    }

    moveNext() {
        const totalItems = this.timeline.querySelectorAll('.timeline__item').length;
        this.currentIndex = Math.min(
            totalItems - this.settings.visibleItems, 
            this.currentIndex + this.settings.moveItems
        );
        this.updateHorizontalPosition();
    }

    updateHorizontalPosition() {
        const items = this.timeline.querySelector('.timeline__items');
        if (items) {
            const translateX = (100 / this.settings.visibleItems) * this.currentIndex;
            items.style.transform = `translateX(-${translateX}%)`;
        }
    }

    checkVerticalItems() {
        const items = this.timeline.querySelectorAll('.timeline__item');
        items.forEach(item => {
            item.classList.add('timeline__item--animate');
        });
    }

    isElementInViewport(element, trigger) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const triggerPoint = typeof trigger === 'string' && trigger.includes('%') ?
            windowHeight * (parseInt(trigger) / 100) : parseInt(trigger);
        
        return rect.top <= windowHeight - triggerPoint;
    }

    checkResponsive() {
        if (this.settings.mode === 'horizontal' && window.innerWidth <= this.settings.forceVerticalMode) {
            this.timeline.classList.remove('timeline--horizontal');
            this.timeline.classList.add('timeline--vertical');
            this.setupVerticalTimeline();
            
            const navButtons = this.timeline.querySelectorAll('.timeline__nav');
            navButtons.forEach(btn => btn.remove());
        } else if (this.settings.mode === 'horizontal' && window.innerWidth > this.settings.forceVerticalMode) {
            this.timeline.classList.remove('timeline--vertical');
            this.timeline.classList.add('timeline--horizontal');
            this.setupHorizontalTimeline();
        }
    }

    setupEventListeners() {
        if (this.settings.mode === 'vertical') {
            window.addEventListener('scroll', () => {
                this.checkVerticalItems();
            });
        }
    }
}

function timeline(elements, options) {
    if (elements) {
        if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
            Array.from(elements).forEach(element => new Timeline(element, options));
        } else {
            if (typeof elements === 'string') {
                elements = document.querySelector(elements);
            }
            if (!elements) return;
            new Timeline(elements, options);
        }
    }
}

// jQuery plugin
if (window.jQuery) {
    window.jQuery.fn.timeline = function(options) {
        return this.each(function() {
            new Timeline(this, options);
        });
    };
}

window.timeline = timeline;
