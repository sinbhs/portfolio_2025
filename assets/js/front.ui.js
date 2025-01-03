/*
 * name : front.ui.js
 * desc : UI 공통 자바스크립트
 * writer : 송지우
 * date : 2024/10/18
 * last : 
*/


var $_btnGoTop,
    $_headerWrapper,
    $_container,
    $_wrapper,
    _dialogCount = 0,
    _scrollTop = 0,
    _isIos,
    _isMac,
    _isAndroid,
    _transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
    _fisHeight = 0,
    _vh,
    _resizeVh,
    _resizeVw,
    _sizeViewSta,
    _noScroll = false,
    _desktopWidth = 890;



var portfolioPub = portfolioPub || {};


portfolioPub.front = portfolioPub.front || (function () {
    var _front;
    _front = {};

    /*
    * date : 20241028
    * last : 20241028
    * name : setMoHeader()
    * pram :
    * desc : mobile header - scroll up/down
    */
    function setMoHeader() {
        var header = $('.header-wrapper');
        if (header === undefined) return false;
       
        $(window).off('scroll', moHeaderScrollDown).on('scroll', moHeaderScrollDown);

        function moHeaderScrollDown() {
            offset = $_headerWrapper.length > 0 ? $_headerWrapper.height() * 1.5 : 30;
            if (_scrollTop >= offset) {
                if (!header.hasClass('scroll-down')) header.addClass('scroll-down');
            } else {
                if (header.hasClass('scroll-down')) header.removeClass('scroll-down');
            }
        }
    }


    /*
    * date : 20241028
    * last : 20241028
    * name : setGoTop()
    * pram :
    * desc : set top button
    */
    function setGoTop() {
        var offset = $_headerWrapper.length > 0 ? $_headerWrapper.height() * 1.5 : 30;
        btnOnOff();

        $_btnGoTop.off('click').on('click', function (e) {
            e.preventDefault();
            $('html, body').stop().queue('fx', []).animate({scrollTop: 0}, 250);
        });

        
        $_btnGoTop.on(_transitionEnd, function () {
            if (!$_btnGoTop.hasClass('is-active')) $_btnGoTop.addClass('is-hide');
        })

        $(window).off('scroll', btnOnOff).on('scroll', btnOnOff);

        function btnOnOff() {
            offset = $_headerWrapper.length > 0 ? $_headerWrapper.height() * 1.5 : 30;
            if (_scrollTop >= offset) {
                if (!$_btnGoTop.hasClass('is-active')) $_btnGoTop.removeClass('is-hide').addClass('is-active');
            } else {
                if ($_btnGoTop.hasClass('is-active')) $_btnGoTop.addClass('is-hide').removeClass('is-active');
            }
        }
    }

    /*
    * date : 20241028
    * last : 20241028
    * name : setTableCaption()
    * pram :
    * desc : 테이블 캡션 생성
    */
    function setTableCaption() {
        $("table[class*='tbl-info']").each(function (index) {
            var table, captionComplex, theadHeader, tbodyHeader;
            table = $(this);
            captionTextOrigin = $(this).find("caption").text();
            captionComplex = '';
            theadHeader = [];
            tbodyHeader = [];

            // thead th값 추출
            if (table.find("thead th").length > 0) {
                table.find("thead th").each(function (index) {
                    theadHeader.push($(this).text());
                });
            }
            // tbody th값 추출
            if (table.find("tbody th").length > 0) {
                table.find("tbody th").each(function (index) {
                    // tbody th가 thead th의 서브 헤더인 경우(thead th와 tbody th가 둘 다 존재하는 경우)
                    if (theadHeader.length > 0) {
                        if (tbodyHeader[$(this).index()] === undefined) {
                            tbodyHeader[$(this).index()] = theadHeader[$(this).index()] + " 컬럼의 하위로";
                        }
                        tbodyHeader[$(this).index()] += " " + $(this).text();
                    } else {
                        tbodyHeader.push($(this).text());
                    }
                });

                tbodyHeader = tbodyHeader.filter(function (n) {
                    return n != undefined
                });
            }

            if (theadHeader.length > 0 && tbodyHeader.length > 0) {
                captionComplex += theadHeader.join(", ") + " " + tbodyHeader.join(", ");
            } else if (theadHeader.length > 0) {
                captionComplex += theadHeader.join(", ");
            } else if (tbodyHeader.length > 0) {
                captionComplex += tbodyHeader.join(", ");
            }

            $(this).find("caption").text(captionTextOrigin + " 테이블로 " + captionComplex + '을(를) 나타낸 표입니다.');
        });
    }

    /*
    * date : 20241028
    * last : 20241028
    * name : titleRevealAni()
    * pram :
    * desc : 타이틀 등장 애니메이션
    */
   function titleRevealAni(selector) {
    selector = selector || '.cont-tit';

    selector.html(
    selector.text()
        .split("")
        .map((letter, idx) => {
        if (letter === " ") return " ";
        return `<span style="animation-delay:${
            idx * 45
        }ms" class="reveal-item">${letter}</span>`;
        })
        .join("")
    );
   }

    /*
    * date : 20241028
    * last : 20241028
    * name : revealIntersectionObserve()
    * pram :
    * desc : reveal intersection observer
    */
   function revealIntersectionObserve() {
    const intersectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                if(entry.target.classList.contains('cont-tit')) {
                    titleRevealAni($(entry.target));
                } else {
                    entry.target.classList.add('reveal');  
                }

                // 위 실행을 처리하고(1회) 관찰 중지
                intersectionObserver.unobserve(entry.target)
            }
        });
    }, {
        rootMargin: `0px 0px 0px 0px`,
        threshold: 0,
    });

    document.querySelectorAll('.reveal-tg').forEach((item) => {
        intersectionObserver.observe(item);
    });
   }

    /*
    * date : 20241028
    * last : 20241028
    * name : setBgChange()
    * pram :
    * desc : 배경색 변경 gsap
    */
   function setBgChange() {
    gsap.utils.toArray(".cont-box").forEach((item) => {
        let bgColor = item.getAttribute("data-bgcolor");
        let textColor = bgColor === "#000" ? "#fff" : "#000"; // 검은 배경 흰 텍스트, 흰 배경 검은 텍스트
        
        ScrollTrigger.create({
            trigger: item,
            start: "top 50%",
            end: "bottom 50%",
            markers: false,
        
            onEnter: () => {
                gsap.to(".container-wrapper", {
                    backgroundColor: bgColor,
                    color: textColor, // 텍스트 색상 변경
                    duration: 1.2,
                });
            },
            onEnterBack: () => {
                gsap.to(".container-wrapper", {
                    backgroundColor: bgColor,
                    color: textColor, // 텍스트 색상 변경
                    duration: 1.2,
                });
            },
        });
    });

    gsap.utils.toArray('.cont-tit .word').forEach(function (it){
        gsap.timeline({
            scrollTrigger : {
                trigger : it,
                start : '100% 100%',
                end : '100% 100%',
                scrub : 1,
            }
        })
            .fromTo(it,{y: 150 }, {y: 0, ease: 'none', duration: 5}, 0)
    })
   }

    /*
    * date : 20241028
    * last : 20241028
    * name : setWorkHoverCursor()
    * pram :
    * desc : cont-box stack gsap
    */
   function setWorkHoverCursor() {
    $(".experience-item .link-site").on("mouseenter", function () {
        const $emoji = $(this).find(".media-emoji");
  
        $(this).on("mousemove", function (event) {
            const offsetX = event.pageX - $(this).offset().left - 50;
            const offsetY = event.pageY - $(this).offset().top - 50;
    
            // GSAP 애니메이션 적용
            gsap.to($emoji, {
                left: offsetX.toFixed(0),
                top: offsetY.toFixed(0),
                duration: .9,
                ease: "power3"
            });
        });
      });
  
      $(".experience-item .link-site").on("mouseleave", function () {
        const $emoji = $(this).find(".media-emoji");
        $(this).off("mousemove"); // mousemove 이벤트 해제
      });
   }

    /*
    * date : 20241028
    * last : 20241028
    * name : createScrollStopListener(element, callback)
    * pram :
    *		@param element  - 스크롤 영역 요소
    *		@param callback - 마이페이지 스크롤이 끝나고 callback 함수
    * desc : 스크롤이 끝난 후 callback 함수 실행
    */
    function createScrollStopListener(element, callback) {
        var handle = null;
        var onScroll = function () {
            var mobileType = navigator.userAgent.toLowerCase();
            var delay = (mobileType.indexOf('iphone') > -1 || mobileType.indexOf('ipad') > -1 || mobileType.indexOf('ipod') > -1) ? 0 : 15;

            if (handle) clearTimeout(handle);
            handle = setTimeout(callback, delay);
        };

        clearTimeout($(document).data('scrollEnd'));

        $(window).on('scroll', function (event) {
            _scrollTop = $(window).scrollTop();
            if ($(document).data('scrollEnd')) clearTimeout($(document).data('scrollStopListener'));
            $(document).data('scrollEnd', setTimeout(onScroll, event));
        });

        return function () {
            clearTimeout($(document).data('scrollEnd'));
            $(window).on('scroll', function (event) {
                _scrollTop = $(window).scrollTop();
                if ($(document).data('scrollEnd')) clearTimeout($(document).data('scrollStopListener'));
                $(document).data('scrollEnd', setTimeout(onScroll, event));
            });
        };
    }

    /*
    * date : 20241028
    * last : 20241028
    * name : setSpsOffsetData()
    * pram :
    * desc : 스크롤 동작시 해당 요소에 도착하면 고정
    */
    function setSpsOffsetData() {
        if ($('[data-pc-sps]').length === 0 && $('[data-mobile-sps]').length === 0 && $('[data-sps]').length === 0) return false;
        var ignoreClassList = [
            // 'header_wrapper',
        ];
        var spsElem = $('[data-sps], [data-pc-sps], [data-mobile-sps]', $_container);
        init();

        $(window).on('resize', init);

        // heightChangeTarget.forEach(function (target, idx) {
        // 	var sensor = null;
        // 	sensor = new ResizeSensor( $('.' + target), function() {
        // 		fixData( $('.sps[data-height-change='+heightChangeTarget[idx]+']') );
        // 	});
        // });
        var sensorContents = new ResizeSensor($('.cont-box', $_container), function () {
            $('.sps').each(function (i) {
                var that = this;
                setTimeout(function () {
                    fixData($(that));
                }, 100);
            })
        });

        $(window).off('scroll', moFixReData).on('scroll', moFixReData);

        var scrollSta;

        function moFixReData() {
            if ($('.wrapper').hasClass('scroll-up') && scrollSta !== 'scroll-up') {
                $('.sps').each(function (i) {
                    var that = this;
                    scrollSta = 'scroll-up';
                    //fixData($(that));
                })


            } else if ($('.wrapper').hasClass('scroll-down') && scrollSta !== 'scroll-down') {
                $('.sps').each(function (i) {
                    var that = this;
                    scrollSta = 'scroll-down';
                    //fixData($(that));
                })
            }
        }

        function fixData(tg) {
            var observerCont,
                addOfs;
            if (tg.siblings('.sps-observer').length === 0) tg.after('<div class="sps-observer"></div>');

            observerCont = tg.siblings('.sps-observer');
            addOfs = (tg.data('add-offset') !== undefined && !isNaN(tg.data('add-offset'))) ? tg.data('add-offset') : 0;

            if (_sizeViewSta === 'mobile' && scrollSta === 'scroll-up' && parseInt(tg.attr('data-sps-offset')) !== Math.round(observerCont.offset().top - $_headerWrapper.outerHeight() - addOfs)) {
                tg.attr('data-sps-offset', Math.round(observerCont.offset().top - $_headerWrapper.outerHeight() - addOfs));

            }
            else if (parseInt(tg.attr('data-sps-offset')) !== Math.round(observerCont.offset().top - addOfs)) {
                tg.attr('data-sps-offset', Math.round(observerCont.offset().top - addOfs));
            }
        }

        function init() {

            // container_wrapper > sps 엘리먼트 타겟팅
            if ((_sizeViewSta === 'desktop' && $(spsElem).attr('data-pc-sps') === 0) && (_sizeViewSta === 'mobile' && $(spsElem).attr('data-mobile-sps') === 0)) return false;

            spsElem.each(function (i) {
                var that = this, isIgnore;
                isIgnore = ignoreClassList.some(function (element) {
                    return $(that).hasClass(element);
                });
                if (!isIgnore) {
                    //spsElem.push(that);
                    // PC
                    if (_sizeViewSta === 'desktop' && $(that).attr('data-pc-sps') !== undefined) {
                        //console.log( $(that).attr('data-pc-sps') );
                        $(that).addClass('sps');
                        fixData($(that));
                        ScrollPosStyler.init();
                    }
                    else if (_sizeViewSta === 'mobile' && $(that).attr('data-mobile-sps') !== undefined) {
                        $(that).addClass('sps');
                        fixData($(that));
                        ScrollPosStyler.init();
                    }
                    else if ($(that).attr('data-sps') !== undefined) {
                        $(that).addClass('sps');
                        fixData($(that));
                        ScrollPosStyler.init();
                    }else {
                        $(that).removeClass('sps sps-abv sps-blw');
                    }

                }

            });
        }
    }

    /*
    * date : 20241028
    * last : 20241028
    * name : contentScrollMove()
    * pram :
     * desc : 해당 컨텐츠 영역으로 스크롤 이동
    */
    function contentScrollMove(target) {
        if (target.length === 0) return false;
        var movePos = target.offset().top;
        var exceptValue = $_headerWrapper.length > 0 ? $_container.data('top-padding').outerHeight() : 0;

        $('html, body').stop().queue('fx', []).animate({
            scrollTop: movePos - exceptValue
        }, 200, function () {
        });
    }

    // sps set
    if (window.ScrollPosStyler) {
        ScrollPosStyler.init({
            classAbove: 'sps-abv',
            classBelow: 'sps-blw',
        });
    }

    $(document).on("touchstart", function (e) {
        _fisHeight = window.innerHeight;
    });

    /*
    * date : 20241028
    * last : 20241028
    * name : breakpointChangeInit()
    * pram :
     * desc : breakpoint 변경될때 초기화
    */
    function breakpointChangeInit() {
        // desktop
        if (_resizeVw > _desktopWidth) {
            if (!$('body').hasClass('desktop') || $_headerWrapper === undefined) {
                $('body').addClass('desktop');
                $_headerWrapper = $('.header-wrapper[data-pc-only]');
                $_container.data('top-padding', $_headerWrapper.outerHeight());
                _sizeViewSta = 'desktop';
            }

        }
        // mobile
        else {
            if ($('body').hasClass('desktop') || $_headerWrapper === undefined) {
                $('body').removeClass('desktop');
                $_headerWrapper = $('.header-wrapper[data-mobile-only]');
                $_container.data('top-padding', $_headerWrapper.outerHeight());
                _sizeViewSta = 'mobile';
            }

        }
    }

    function getBodyHeight() {
        var myHeight = 0;
        if (typeof (window.innerHeight) == 'number') myHeight = window.innerHeight;
        else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) myHeight = document.documentElement.clientHeight;
        else if (document.body && (document.body.clientWidth || document.body.clientHeight)) myHeight = document.body.clientHeight;
        return myHeight;
    }


    function setPropertyVh() {
        document.documentElement.style.setProperty('--vh', _vh + 'px');
        document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
    }

    /**
     * date : 20220901
     * last : 20220901
     * name : debounce()
     * pram :
     *        @param func {function} 실행 함수
     *        @param wait {number} 시간 지정 ( 지정 시간 지난 후 함수 실행 )
     * desc : 지정 시간 끝난 후 함수 실행
     * ex) $contWrap.on('scroll',portfolioPub.front.debounce(test, 400));
     */
    function debounce(func, wait) {
        var inDebounce;
        return function() {
            const context = this;
            const args = arguments;
            // setTimeout이 실행된 Timeout의 ID를 반환하고, clearTimeout()으로 이를 해제할 수 있음을 이용
            clearTimeout(inDebounce);

            inDebounce = setTimeout(() => func.apply(context, args), wait);
        };
    }

    _front.breakpointChangeInit = breakpointChangeInit;
    _front.setSpsOffsetData = setSpsOffsetData;
    _front.contentScrollMove = contentScrollMove;
    _front.debounce = debounce;

    $(document).on("touchstart", function (e) {
        _fisHeight = window.innerHeight;
    });

    createScrollStopListener(window, function () {
        if ($('.ui-dialog-container.open').length > 0) return false;
        if (_isIos && _isMac && window.innerHeight !== _fisHeight) {
            //_resizeVh = (window.innerHeight + 1);
            _resizeVh = getBodyHeight * 0.01;
            document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
        } else if (_isAndroid && window.outerHeight !== _fisHeight) {
            _resizeVh = window.outerHeight;
            document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
        }
    });

    $(document).ready(function () {
        $_btnGoTop = $('.btn-go-top');
        $_container = $('.container-wrapper');
        $_wrapper = $('.wrapper');


        _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;

        setTableCaption();
        breakpointChangeInit();
        setMoHeader();
        setGoTop();
        setBgChange();
        setWorkHoverCursor();
        revealIntersectionObserve();

        /* 맥 OS 또는 iOS / android 디바이스 체크 */
        _isIos = /(iPhone|iPod|iPad)/i.test(navigator.platform);
        _isMac = /(Mac)/i.test(navigator.platform);
        _isAndroid = /Android/i.test(navigator.userAgent);


        if (_isIos) {
            _vh = getBodyHeight * 0.01;
            _resizeVh = getBodyHeight * 0.01;
            setPropertyVh();
            $('body').addClass('ios');
        }
        if (_isMac) {
            _vh = getBodyHeight * 0.01;
            _resizeVh = getBodyHeight * 0.01;
            setPropertyVh();
            $('body').addClass('mac');
        }
        if (_isAndroid) {
            _vh = window.outerHeight;
            _resizeVh = window.outerHeight;
            setPropertyVh();
            $('body').addClass('android');
        } else {
            _vh = window.innerHeight;
            _resizeVh = window.innerHeight;
            setPropertyVh();
        }


        // 회전변경 이벤트 발생 시 : 100vh 스타일 지정
        $(window).on('resize orientationchange observerUpdate', function () {
            _resizeVh = window.outerHeight;
            _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;
            _scrollTop = $(window).scrollTop();
            breakpointChangeInit();

            if (_isIos && _isMac) {
                _resizeVh = getBodyHeight * 0.01;
                setPropertyVh();
            }
            if (_isAndroid) {
                _resizeVh = window.outerHeight;
                setPropertyVh();
            } else {
                _resizeVh = window.innerHeight;
                setPropertyVh();
            }

            if ($(".ui-dialog-container:visible").length > 0) {
                $(".ui-dialog-container:visible").each(function (i) {
                    if ($('.ui-dialog-content', this).data('mobile-popup') !== undefined && _sizeViewSta === 'desktop') {
                        dialogOnOff().popClose('#' + $('.ui-dialog', this).attr('aria-describedby'));
                    } else if ($('.ui-dialog-content', this).data('pc-popup') !== undefined && _sizeViewSta === 'mobile') {
                        dialogOnOff().popClose('#' + $('.ui-dialog', this).attr('aria-describedby'));
                    }
                });
            }

            if( _sizeViewSta === 'desktop' && $('body').hasClass('dialog-open') ) {
                $('body').css({width: _resizeVw});
            }
            else {
                $('body').css({width: '100%'});
            }

        });

        setSpsOffsetData();
    });

    return _front;
})();

