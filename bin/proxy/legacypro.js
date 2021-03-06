'use strict';

/**
 * Created by robin on 1/14/16.
 */
var express = require('express'),
    agent = require('../agent'),
    ropRouter = require('../router'),
    log4js = require('log4js'),
    constant = require("../constant"),
    i18n = require('../i18n');;
var router = express.Router(),
    info = { ssv_id: "b4ffce1c-0b1a-4e52-b244-d7e13ec6aeac", ssv_name: "", cat_id: "" };

router.use('/:func/:id.html', function (request, response, next) {
    var id = request.params.id,
        func = request.params.func,
        param = {};
    param[func == 'api' ? "api_id" : "domain_id"] = id;
    request.session.locale && (param.lang_flag = i18n.localeMap[request.session.locale]);
    agent.deliver(ropRouter.deliverOption('common', 'sponsor', 'get_ssv', param)).then(function (rawBody) {
        if (rawBody.error_response) {
            agent.renderErrorHandler(response, rawBody.error_response.msg);
            return;
        }
        var body = constant.ROPRequestType == 1 ? rawBody : JSON.parse(rawBody.rop_api_data_get_response.result);

        if (typeof body.is_success == 'boolean' && body.is_success || typeof body.is_success == 'string' && body.is_success == 'true') {
            if (!new RegExp('^' + body.user_domain + '\\.' + constant.domain + '(:(' + constant.port + '|' + constant.optionPort + ')){0,1}$').test(request.headers.host)) {
                response.redirect(constant.protocol + '://' + body.user_domain + '.' + constant.domain + ':' + constant.port + request.originalUrl);
            } else {
                info.ssv_id = body.ssv_user_id;
                info.ssv_name = body.ssv_user_name;
                info.cat_id = body.cat_id;
                next();
            }
        } else {
            response.send(body.msg);
        }
    }).done(function () {
        //responseponse.render('pages/' + module + '/partials/' + partial);
    }, function (why) {
        agent.logger.info("Error in module Legacy, while delivering router /:func-:id.html");
        agent.logger.error(why);
        //response.send(why);
        agent.renderErrorHandler(response, why);
    });
});

router.get('/api/:id', function (request, response) {
    info.method = "api";
    info.id = request.params.id;
    var param = { _session_id: request.session.id, _info: JSON.stringify(info), _injection: constant.clientSideScript };
    response.render('pages/supplier/index', param, function (error, html) {
        agent.renderErrorHandler(response, error, html);
    });
});
router.get('/domain/:id', function (request, response) {
    info.method = "domain";
    info.id = request.params.id;
    var param = { _session_id: request.session.id, _info: JSON.stringify(info), _injection: constant.clientSideScript };
    response.render('pages/supplier/index', param, function (error, html) {
        agent.renderErrorHandler(response, error, html);
    });
});

router.get('*', function (request, response) {
    //response.redirect(`${constant.protocol}://${constant.domain}:${constant.port}/welcome/API`);
    response.redirect(constant.protocol + '://' + constant.domain + ':' + constant.port);
});
module.exports = router;