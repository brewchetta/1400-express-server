import { Routes, Route } from 'react-router-dom'

import NewCharacterForm from 'router-pages/NewCharacterFormPage/NewCharacterForm'
import CharacterSheet from 'router-pages/CharacterSheetPage/CharacterSheet'
import CharactersIndex from 'router-pages/CharactersIndexPage/CharactersIndex'
import Rulebook from 'router-pages/RulebookPage/RulebookMain'
import ChangeLog from 'router-pages/ChangeLog/ChangeLog'
import LoginSignup from 'router-pages/Auth/LoginSignup'
import GroupsDashboard from 'router-pages/GroupsDashboardPage/GroupsDashboard'
import GroupPage from 'router-pages/GroupPage/GroupPage'

import { CharacterContextProvider } from 'context/CharacterContext'
import { useCurrentUserContext } from 'context/CurrentUserContext'

// ALL ROUTES ADDED HERE
// - NewCharacterForm
// - CharactersIndex
// - CharacterSheet
// - Rulebook (with activeCard param too)
// - ChangeLog
// - GroupsDashboard
// - GroupPage
// - NewGroupForm

function AppRoutes() {

  const { currentUser } = useCurrentUserContext()

  if (currentUser) {
    
    return (
      <Routes>
        <Route path='/' element={<CharactersIndex />} />
        <Route path='create-character' element={<NewCharacterForm />} />
        <Route path='story-groups/:groupName/:groupId/create-character/:playerId' element={<NewCharacterForm />} />
        <Route path='characters/:nameSlug/:id' element={
          <CharacterContextProvider>
            <CharacterSheet />
          </CharacterContextProvider>
        } />
        <Route path='rulebook' element={<Rulebook />} />
        <Route path='rulebook/:nav' element={<Rulebook />} />
        <Route path='changelog' element={<ChangeLog />} />
        <Route path='story-groups' element={<GroupsDashboard />} />
        <Route path='story-groups/:name/:id' element={<GroupPage />} />
      </Routes>
    )
    
  } else {
    return (
      <Routes>
        <Route path='rulebook' element={<Rulebook />} />
        <Route path='rulebook/:nav' element={<Rulebook />} />
        <Route path='changelog' element={<ChangeLog />} />
        <Route path="*" element={<LoginSignup />}/>
      </Routes>
    )
  }
}

export default AppRoutes
