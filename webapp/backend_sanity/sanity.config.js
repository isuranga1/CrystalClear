import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import testimonials from './schemas/testimonials'
import abouts from './schemas/abouts'
import brands from './schemas/brands'
import contact from './schemas/contact'
import experiences from './schemas/experiences'
import workExperience from './schemas/workExperience'
import skills from './schemas/skills'
import works from './schemas/works'




export default defineConfig({
  name: 'default',
  title: 'Crystal clear1',

  projectId: '6o2hmqh3',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,testimonials,abouts,brands,contact,experiences,skills,workExperience,works
  },
})

