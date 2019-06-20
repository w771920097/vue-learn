
const Tpl = () => import(/* webpackChunkName: "tpl" */'./views')
const TplHome = () => import(/* webpackChunkName: "tpl-home" */'./views/children/home')

import layout from './views/components/layout'

export default (v) => ({
  path: `/${v}/tpl`,
  component: Tpl,
  redirect: `/${v}/tpl/home`,
  meta: { layout },
  children: [
    {
      path: `/${v}/tpl/home`,
      component: TplHome,
    },
  ],
})