import React from 'react'

import type { Field } from 'payload/types'
import { getNextT } from '../../utilities/getNextT'
import {
  MinimalTemplate,
  FormSubmit,
  Form,
  RenderFields,
  fieldTypes,
  buildStateFromSchema,
} from '@payloadcms/ui'
import { SanitizedConfig } from 'payload/types'
import { Metadata } from 'next'
import { meta } from '../../utilities/meta'

import './index.scss'
import { initPage } from '../../utilities/initPage'

const baseClass = 'create-first-user'

export const generateMetadata = async ({
  config,
}: {
  config: Promise<SanitizedConfig>
}): Promise<Metadata> => {
  const t = await getNextT({
    config: await config,
  })

  return meta({
    title: t('authentication:createFirstUser'),
    description: t('authentication:createFirstUser'),
    keywords: t('general:create'),
    config,
  })
}

export const CreateFirstUser: React.FC<{
  config: Promise<SanitizedConfig>
}> = async ({ config: configPromise }) => {
  const {
    config,
    user,
    locale,
    i18n,
    i18n: { t },
    payload,
  } = await initPage({
    configPromise,
    redirectUnauthenticatedUser: false,
  })

  const {
    admin: { user: userSlug },
    collections,
    routes: { admin, api },
    serverURL,
  } = config

  const userConfig = collections.find((collection) => collection.slug === userSlug)

  // const onSuccess = async (json) => {
  //   if (json?.user?.token) {
  //     await fetchFullUser()
  //   }

  //   setInitialized(true)
  // }

  const fields = [
    {
      name: 'email',
      label: t('general:emailAddress'),
      required: true,
      type: 'email',
    },
    {
      name: 'password',
      label: t('general:password'),
      required: true,
      type: 'password',
    },
    {
      name: 'confirm-password',
      label: t('authentication:confirmPassword'),
      required: true,
      type: 'confirmPassword',
    },
  ] as Field[]

  const formState = await buildStateFromSchema({
    fieldSchema: fields,
    locale: locale.code,
    operation: 'create',
    preferences: {},
    t,
    user,
  })

  return (
    <MinimalTemplate className={baseClass}>
      <h1>{t('general:welcome')}</h1>
      <p>{t('authentication:beginCreateFirstUser')}</p>
      <Form
        action={`${serverURL}${api}/${userSlug}/first-register`}
        method="POST"
        // onSuccess={onSuccess}
        redirect={admin}
        validationOperation="create"
      >
        <RenderFields
          fieldSchema={[...fields, ...userConfig.fields]}
          fieldTypes={fieldTypes}
          user={user}
          formState={formState}
          i18n={i18n}
          payload={payload}
        />
        <FormSubmit>{t('general:create')}</FormSubmit>
      </Form>
    </MinimalTemplate>
  )
}