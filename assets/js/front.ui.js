/*
 * name : front.ui.js
 * desc : UI 공통 스크립트
 * writer : 송지우
 * date : 2025/01/06
 * last : 2025/01/31
 */
document.addEventListener("DOMContentLoaded", function () {
    var _scrollTop = window.scrollY;
    var _transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd otransitionend";
    var _vh = window.innerHeight;
    var _resizeVh = window.innerHeight;
    var _resizeVw = window.innerWidth;
    var _desktopWidth = 890;
    var _sizeViewSta;
    var _noScroll = false;

    var wrapper = document.querySelector(".wrapper");
    var headerWrapper = document.querySelector(".header-wrapper");
    var container = document.querySelector(".container-wrapper");
    var btnGoTop = document.querySelector(".btn-go-top");

    /*
    * date : 20250106
    * last : 20250113
    * name : setMoHeader()
    * pram :
    * desc : mobile header - scroll up/down, current time update
    */
    function setMoHeader() {
        if (!headerWrapper) return;

        var offset = headerWrapper.offsetHeight / 2;
        var pageHeight = wrapper.offsetHeight - getBodyHeight() - headerWrapper.offsetHeight;
        var prevScrollTop = 0;

        new ResizeSensor(wrapper, function () {
            if (_sizeViewSta === "mobile") {
                pageHeight = wrapper.offsetHeight - getBodyHeight() - headerWrapper.offsetHeight;
                scrollUpDown();
                if (_scrollTop === 0) {
                    document.querySelector(".header-wrapper").classList.remove("scroll-up", "scroll-down");
                }
            }
        });

        createScrollStopListener(window, function () {
            if (_sizeViewSta === "desktop") {
                document.querySelector(".header-wrapper").classList.remove("scroll-up", "scroll-down");
            } else {
                scrollUpDown();
            }
        });

        function scrollUpDown() {
            var el = document.querySelector(".header-wrapper");
            pageHeight = wrapper.offsetHeight - getBodyHeight() - headerWrapper.offsetHeight;

            if (wrapper.offsetHeight <= _resizeVh + 31) return;

            if (_noScroll) {
                if (el && !el.classList.contains("scroll-down")) {
                    el.classList.remove("scroll-up");
                    el.classList.add("scroll-down");
                }
                return;
            }

            if (!el) return;

            if (_scrollTop === 0 || _scrollTop < offset) {
                el.classList.remove("scroll-up", "scroll-down");
            } else {
                if (prevScrollTop < _scrollTop && _scrollTop > offset) {
                    el.classList.remove("scroll-up");
                    el.classList.add("scroll-down");
                } else if (_scrollTop < pageHeight && _scrollTop > offset) {
                    el.classList.remove("scroll-down");
                    el.classList.add("scroll-up");
                }
            }

            prevScrollTop = _scrollTop;
        }

        function getKoreaTime() {
            var now = new Date();
            var timeText =
                String(now.getHours()).padStart(2, "0") +
                ":" +
                String(now.getMinutes()).padStart(2, "0") +
                ":" +
                String(now.getSeconds()).padStart(2, "0");
                const timeElement = document.querySelector(".current-time .time");
                if (timeElement) {
                    timeElement.textContent = timeText;
                }
        }

        getKoreaTime();
        setInterval(getKoreaTime, 1000);
    }

    /*
    * date : 250106
    * last : 250106
    * name : setGoTop()
    * pram :
    * desc : 최상단 이동 버튼
    */
    function setGoTop() {
        var offset = headerWrapper.offsetHeight * 1.5;
        btnOnOff();

        btnGoTop?.addEventListener("click", function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        btnGoTop?.addEventListener(_transitionEnd, function () {
            if (!btnGoTop.classList.contains("is-active")) btnGoTop.classList.add("is-hide");
        });

        window.addEventListener("scroll", btnOnOff);

        function btnOnOff() {
            offset = headerWrapper.offsetHeight * 1.5;
            if (_scrollTop >= offset) {
                btnGoTop.classList.remove("is-hide");
                btnGoTop.classList.add("is-active");
            } else {
                btnGoTop.classList.add("is-hide");
                btnGoTop.classList.remove("is-active");
            }
        }
    }

    /*
    * date : 250106
    * last : 250106
    * name : setTableCaption()
    * pram :
    * desc : 테이블 캡션 생성
    */
    function setTableCaption() {
        document.querySelectorAll("table[class*='tbl-info']").forEach(function(table) {
            var captionTextOrigin = table.querySelector("caption").textContent;
            var captionComplex = '';
            var theadHeader = [];
            var tbodyHeader = [];
    
            // thead th values 추출
            var theadTh = table.querySelectorAll("thead th");
            if (theadTh.length > 0) {
                theadTh.forEach(function(th) {
                    theadHeader.push(th.textContent);
                });
            }
    
            // tbody th values 추출
            var tbodyTh = table.querySelectorAll("tbody th");
            if (tbodyTh.length > 0) {
                tbodyTh.forEach(function(th, index) {
                    // If tbody th is a sub-header of thead th (if both exist)
                    if (theadHeader.length > 0) {
                        if (tbodyHeader[index] === undefined) {
                            tbodyHeader[index] = theadHeader[index] + " 컬럼의 하위로";
                        }
                        tbodyHeader[index] += " " + th.textContent;
                    } else {
                        tbodyHeader.push(th.textContent);
                    }
                });
    
                tbodyHeader = tbodyHeader.filter(function(value) {
                    return value !== undefined;
                });
            }
    
            if (theadHeader.length > 0 && tbodyHeader.length > 0) {
                captionComplex += theadHeader.join(", ") + " " + tbodyHeader.join(", ");
            } else if (theadHeader.length > 0) {
                captionComplex += theadHeader.join(", ");
            } else if (tbodyHeader.length > 0) {
                captionComplex += tbodyHeader.join(", ");
            }
    
            table.querySelector("caption").textContent = captionTextOrigin + " 테이블로 " + captionComplex + '을(를) 나타낸 표입니다.';
        });
    }


    /*
    * date : 250106
    * last : 250106
    * name : revealIntersectionObserve()
    * pram :
    * desc : reveal intersection observer
    */
    function revealIntersectionObserve() {
        const intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    observer.unobserve(entry.target); // 한 번만 실행 후 해제
                }
            });
        }, {
            rootMargin: `0px 0px 50px 0px`,
            threshold: 0
        });
    
        document.querySelectorAll('.reveal-tg').forEach(item => {
            const rect = item.getBoundingClientRect();
            const isPastViewport = rect.bottom < 0; // 화면 상단을 지나갔는지 확인
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0; // 뷰포트 안에 있는지 확인
    
            if (isPastViewport || isInViewport) {
                item.classList.add('reveal');
            } else {
                intersectionObserver.observe(item);
            }
        });
    }

    /*
    * date : 250106
    * last : 250106
    * name : createScrollStopListener(element, callback)
    * pram :
    *		@param element  - 스크롤 영역 요소
    *		@param callback - 스크롤이 끝나고 callback 함수
    * desc : 스크롤이 끝난 후 callback 함수 실행
    */
    function createScrollStopListener(element, callback) {
        var handle = null;
        var onScroll = function () {
            if (handle) clearTimeout(handle);
            handle = setTimeout(callback, 15);
        };

        window.addEventListener("scroll", function () {
            _scrollTop = window.scrollY;
            if (handle) clearTimeout(handle);
            handle = setTimeout(onScroll, 15);
        });
    }

    /*
    * date : 250106
    * last : 250106
    * name : breakpointChangeInit()
    * pram :
    * desc : breakpoint 변경될때 초기화
    */
    function breakpointChangeInit() {
        if (_resizeVw > _desktopWidth) {
            document.body.classList.add("desktop");
            _sizeViewSta = "desktop";
        } else {
            document.body.classList.remove("desktop");
            _sizeViewSta = "mobile";
        }
    }

    // body height
    function getBodyHeight() {
        return window.innerHeight;
    }

    // vh
    function setPropertyVh() {
        document.documentElement.style.setProperty("--vh", _vh + "px");
        document.documentElement.style.setProperty("--reVh", _resizeVh + "px");
    }

    // smoothScroll 기능 추가
    function smoothScroll() {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    setMoHeader();
    setGoTop();
    setTableCaption();
    revealIntersectionObserve();
    breakpointChangeInit();
    setPropertyVh();
    smoothScroll();

    window.addEventListener("resize", function () {
        _resizeVh = window.innerHeight;
        _resizeVw = window.innerWidth;
        _scrollTop = window.scrollY;
        breakpointChangeInit();
        setPropertyVh();
    });
});