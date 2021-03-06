/**
 * Created by robin on 1/14/16.
 */
let express = require('express'), agent = require('../agent'), ropRouter = require('../router'),
  log4js = require('log4js'), constant = require('../constant'), i18n = require('../i18n')

let router = express.Router()

router.use('/:func/:id', (request, response, next) => {
  let id = request.params.id, func = request.params.func, param = {}, isAPI = (func == 'api')
  if (id && func) {
    param[(isAPI ? 'api_id' : 'domain_id')] = id
    request.session.locale && (param.lang_flag = i18n.localeMap[request.session.locale])
    agent.deliver(ropRouter.deliverOption('common', 'sponsor', 'get_ssv', param))
      .then(rawBody => {
        if (rawBody.error_response) {
          agent.renderErrorHandler(response, rawBody.error_response.msg)
          return
        }
        let body = (constant.ROPRequestType == 1) ? rawBody : JSON.parse(rawBody.rop_api_data_get_response.result)

        if (((typeof body.is_success == 'boolean') && body.is_success) || ((typeof body.is_success == 'string') && (body.is_success == 'true'))) {
          if (!(new RegExp(`^${body.user_domain}\\.${constant.domain}(:(${constant.port}|${constant.optionPort})){0,1}$`).test(request.headers.host))) {
            response.redirect(`${constant.protocol}://${body.user_domain}.${constant.domain}${request.originalUrl}`)
          } else {
            var info = {
              ssv_id: body.ssv_user_id,
              ssv_name: body.ssv_user_name,
              cat_id: body.cat_id,
              id: id,
              method: isAPI ? 'api' : 'domain'
            }, param = {
              _session_id: request.session.id,
              _info: `window.ssv_info = ${JSON.stringify(info)}`,
              _injection: constant.clientSideScript
            }
            response.render('pages/supplier/index', param, (error, html) => {
              agent.renderErrorHandler(response, error, html)
            })
          }
        } else {
          response.send(body.msg)
        }
      }, why => {
        agent.logger.info('Error in module Legacy, while delivering router /:func-:id.html')
        agent.logger.error(why)
        //response.send(why);
        agent.renderErrorHandler(response, why)
      })
  } else {
    next()
  }
})
module.exports = router
