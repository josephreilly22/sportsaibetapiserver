const logout = (req, res) => {
    req.logout();
    res.json({'status': 'logged out'})
}

module.exports = { logout };